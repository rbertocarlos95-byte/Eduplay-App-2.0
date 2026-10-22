"""Backend local de EduPlay: cuentas, clases, tareas, entregas y progreso."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from datetime import date
import hashlib
import hmac
import json
import secrets
import sqlite3
import urllib.parse
import uuid

ROOT = Path(__file__).parent
DB = ROOT / 'eduplay.db'
GRADES = {'1','2','3','4','5','6','7','8','9','bg1','bg2','bt1','bt2','bt3'}
SUBJECTS = {'Matemáticas','Lenguaje','Ciencias Naturales','Estudios Sociales','Programación y desarrollo de software','Robótica'}

def connect():
    c = sqlite3.connect(DB, timeout=10)
    c.row_factory = sqlite3.Row
    c.execute('PRAGMA foreign_keys=ON')
    c.execute('PRAGMA busy_timeout=10000')
    c.executescript('''
      CREATE TABLE IF NOT EXISTS players(
        id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
        password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student', grade_id TEXT, active INTEGER NOT NULL DEFAULT 1,
        created TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS sessions(
        token TEXT PRIMARY KEY, player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        created TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS classes(
        id TEXT PRIMARY KEY, teacher_id TEXT NOT NULL REFERENCES players(id), name TEXT NOT NULL,
        grade_id TEXT NOT NULL, section TEXT DEFAULT '', join_code TEXT UNIQUE NOT NULL,
        created TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS class_members(
        class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        joined TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(class_id, student_id));
      CREATE TABLE IF NOT EXISTS assignments(
        id TEXT PRIMARY KEY, class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        teacher_id TEXT NOT NULL REFERENCES players(id), subject TEXT NOT NULL, grade_id TEXT NOT NULL,
        topic_id TEXT NOT NULL, title TEXT NOT NULL, instructions TEXT NOT NULL, due_date TEXT,
        created TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS submissions(
        id TEXT PRIMARY KEY, assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE, answer TEXT NOT NULL,
        self_check TEXT DEFAULT '', attempts INTEGER NOT NULL DEFAULT 1, score REAL, feedback TEXT DEFAULT '',
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP, graded_at TEXT,
        UNIQUE(assignment_id, student_id));
      CREATE TABLE IF NOT EXISTS practice_attempts(
        id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        grade_id TEXT NOT NULL, subject TEXT NOT NULL, topic_id TEXT NOT NULL,
        topic_title TEXT NOT NULL, answer TEXT NOT NULL, self_check TEXT DEFAULT '',
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS topic_progress(
        student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        grade_id TEXT NOT NULL, subject TEXT NOT NULL, topic_id TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0, best_score REAL, mastered INTEGER NOT NULL DEFAULT 0,
        updated TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(student_id, grade_id, subject, topic_id));
      CREATE TABLE IF NOT EXISTS quiz_attempts(
        id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        grade_id TEXT NOT NULL, subject TEXT NOT NULL, topic_title TEXT NOT NULL,
        score REAL NOT NULL, correct_count INTEGER NOT NULL, question_count INTEGER NOT NULL,
        xp INTEGER NOT NULL DEFAULT 0, best_streak INTEGER NOT NULL DEFAULT 0,
        duration_seconds INTEGER NOT NULL DEFAULT 0, answers_json TEXT NOT NULL DEFAULT '[]',
        created TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS student_badges(
        id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        code TEXT NOT NULL, label TEXT NOT NULL, created TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id,code));
    ''')
    cols = {r['name'] for r in c.execute('PRAGMA table_info(players)').fetchall()}
    if 'role' not in cols:
        c.execute("ALTER TABLE players ADD COLUMN role TEXT NOT NULL DEFAULT 'student'")
    if 'grade_id' not in cols:
        c.execute('ALTER TABLE players ADD COLUMN grade_id TEXT')
    if 'active' not in cols:
        c.execute('ALTER TABLE players ADD COLUMN active INTEGER NOT NULL DEFAULT 1')
    c.commit()
    return c

def json_body(handler):
    size = int(handler.headers.get('Content-Length', '0') or 0)
    if size > 65536:
        raise ValueError('La solicitud supera el tamaño permitido.')
    return json.loads(handler.rfile.read(size) or b'{}')

def safe_user(row):
    return {'id': row['id'], 'username': row['username'], 'name': row['name'],
            'role': row['role'], 'gradeId': row['grade_id'], 'active': bool(row['active'])}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_args):
        pass

    def send_json(self, data, status=200):
        raw = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(raw)

    def token_user(self, c, token):
        return c.execute('''SELECT p.* FROM players p JOIN sessions s ON s.player_id=p.id
                            WHERE s.token=? AND p.active=1''', (str(token),)).fetchone()

    def get_user(self, c, token):
        user = self.token_user(c, token)
        if not user:
            self.send_json({'error':'La sesión venció. Inicia sesión de nuevo.'}, 401)
        return user

    def do_POST(self):
        try:
            data = json_body(self)
        except (ValueError, json.JSONDecodeError):
            return self.send_json({'error':'Solicitud JSON inválida o demasiado grande.'}, 400)
        c = connect()
        try:
            path = urllib.parse.urlparse(self.path).path
            if path == '/api/register':
                name = ' '.join(str(data.get('name','')).split())[:80]
                username = ''.join(str(data.get('username','')).lower().split())[:32]
                password = str(data.get('password',''))
                grade_id = str(data.get('gradeId',''))
                if len(name) < 2 or len(username) < 3 or len(password) < 8:
                    return self.send_json({'error':'Usa un nombre de 2 letras, usuario de 3 y contraseña de 8 caracteres.'},400)
                if not all(ch.isalnum() or ch in '._-' for ch in username):
                    return self.send_json({'error':'El usuario solo puede tener letras, números, punto, guion o guion bajo.'},400)
                if grade_id and grade_id not in GRADES:
                    return self.send_json({'error':'Selecciona un grado válido.'},400)
                salt = secrets.token_bytes(16)
                digest = hashlib.pbkdf2_hmac('sha256',password.encode(),salt,310000).hex()
                # La primera cuenta instala y administra el espacio local. Las siguientes empiezan como estudiantes.
                c.execute('BEGIN IMMEDIATE')
                requested_role = str(data.get('accountType','student'))
                if requested_role not in ('student','teacher'):
                    return self.send_json({'error':'Selecciona Estudiante o Profesor/a.'},400)
                first_account = c.execute('SELECT COUNT(*) FROM players').fetchone()[0] == 0
                role = 'admin' if first_account else ('teacher_pending' if requested_role == 'teacher' else 'student')
                pid = uuid.uuid4().hex
                c.execute('INSERT INTO players(id,username,name,password_hash,password_salt,role,grade_id) VALUES(?,?,?,?,?,?,?)',
                          (pid,username,name,digest,salt.hex(),role,grade_id or None))
                token = secrets.token_urlsafe(32)
                c.execute('INSERT INTO sessions(token,player_id) VALUES(?,?)',(token,pid))
                c.commit()
                return self.send_json({'user':safe_user(c.execute('SELECT * FROM players WHERE id=?',(pid,)).fetchone()),'token':token,
                                       'notice':'La primera cuenta quedó como administradora.' if role=='admin' else ('Solicitud de cuenta docente enviada. Administración debe autorizarla antes de habilitar las herramientas.' if role=='teacher_pending' else 'La cuenta se creó como estudiante.')},201)

            if path == '/api/login':
                username = ''.join(str(data.get('username','')).lower().split())[:32]
                password = str(data.get('password',''))
                p = c.execute('SELECT * FROM players WHERE username=?',(username,)).fetchone()
                valid = bool(p and p['active'] and hmac.compare_digest(
                    hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(p['password_salt']),310000).hex(),p['password_hash']))
                if not valid:
                    return self.send_json({'error':'Usuario o contraseña incorrectos.'},401)
                token = secrets.token_urlsafe(32)
                c.execute('INSERT INTO sessions(token,player_id) VALUES(?,?)',(token,p['id']))
                c.commit()
                return self.send_json({'user':safe_user(p),'token':token})

            if path == '/api/logout':
                c.execute('DELETE FROM sessions WHERE token=?',(str(data.get('token','')),)); c.commit()
                return self.send_json({'ok':True})

            user = self.get_user(c,data.get('token',''))
            if not user: return

            if path == '/api/profile':
                name = ' '.join(str(data.get('name',user['name'])).split())[:80]
                grade_id = str(data.get('gradeId',''))
                if len(name)<2 or grade_id not in GRADES:
                    return self.send_json({'error':'Completa tu nombre y selecciona un grado válido.'},400)
                c.execute('UPDATE players SET name=?,grade_id=? WHERE id=?',(name,grade_id,user['id']));c.commit()
                return self.send_json({'user':safe_user(c.execute('SELECT * FROM players WHERE id=?',(user['id'],)).fetchone())})

            if path == '/api/admin/role':
                if user['role']!='admin': return self.send_json({'error':'Solo administración puede cambiar roles.'},403)
                target = str(data.get('userId','')); role = str(data.get('role',''))
                if role not in ('student','teacher','teacher_pending','admin'): return self.send_json({'error':'Rol inválido.'},400)
                if target == user['id'] and role != 'admin': return self.send_json({'error':'No puedes quitarte el rol de administrador mientras administras el sistema.'},400)
                if not c.execute('SELECT id FROM players WHERE id=?',(target,)).fetchone(): return self.send_json({'error':'No se encontró esa cuenta.'},404)
                c.execute('UPDATE players SET role=? WHERE id=?',(role,target));c.commit()
                return self.send_json({'ok':True})

            if path == '/api/classes':
                if user['role'] not in ('teacher','admin'): return self.send_json({'error':'Solo una cuenta docente autorizada puede crear clases.'},403)
                name=' '.join(str(data.get('name','')).split())[:80];grade_id=str(data.get('gradeId',''));section=' '.join(str(data.get('section','')).split())[:24]
                if len(name)<2 or grade_id not in GRADES: return self.send_json({'error':'Indica nombre y grado válido para la clase.'},400)
                class_id=uuid.uuid4().hex;join_code=secrets.token_hex(3).upper()
                c.execute('INSERT INTO classes(id,teacher_id,name,grade_id,section,join_code) VALUES(?,?,?,?,?,?)',(class_id,user['id'],name,grade_id,section,join_code));c.commit()
                return self.send_json({'class':{'id':class_id,'name':name,'gradeId':grade_id,'section':section,'joinCode':join_code}},201)

            if path == '/api/classes/join':
                if user['role']!='student': return self.send_json({'error':'Solo estudiantes pueden unirse con código.'},403)
                code=str(data.get('joinCode','')).strip().upper()
                classroom=c.execute('SELECT * FROM classes WHERE join_code=?',(code,)).fetchone()
                if not classroom: return self.send_json({'error':'No se encontró una clase con ese código.'},404)
                if user['grade_id'] and user['grade_id']!=classroom['grade_id']:
                    return self.send_json({'error':'Tu grado de perfil no coincide con el grado de esta clase. Actualiza Perfil o consulta al docente.'},400)
                c.execute('INSERT OR IGNORE INTO class_members(class_id,student_id) VALUES(?,?)',(classroom['id'],user['id']));c.commit()
                return self.send_json({'ok':True})

            if path == '/api/assignments':
                if user['role'] not in ('teacher','admin'): return self.send_json({'error':'Solo docentes autorizados pueden asignar tareas.'},403)
                class_id=str(data.get('classId',''));classroom=c.execute('SELECT * FROM classes WHERE id=? AND teacher_id=?',(class_id,user['id'])).fetchone()
                if not classroom: return self.send_json({'error':'Clase no encontrada o sin autorización.'},403)
                subject=str(data.get('subject',''));topic_id=str(data.get('topicId',''));title=' '.join(str(data.get('title','')).split())[:120]
                instructions=' '.join(str(data.get('instructions','')).split())[:2000];due_date=str(data.get('dueDate',''))
                if subject not in SUBJECTS or not topic_id or len(title)<2 or len(instructions)<5: return self.send_json({'error':'Completa materia, tema, título e instrucciones.'},400)
                if due_date:
                    try: date.fromisoformat(due_date)
                    except ValueError: return self.send_json({'error':'La fecha de entrega no es válida.'},400)
                aid=uuid.uuid4().hex
                c.execute('INSERT INTO assignments(id,class_id,teacher_id,subject,grade_id,topic_id,title,instructions,due_date) VALUES(?,?,?,?,?,?,?,?,?)',
                          (aid,class_id,user['id'],subject,classroom['grade_id'],topic_id,title,instructions,due_date or None));c.commit()
                return self.send_json({'ok':True,'id':aid},201)

            if path == '/api/submissions':
                if user['role']!='student': return self.send_json({'error':'La entrega debe realizarse desde una cuenta de estudiante.'},403)
                assignment_id=str(data.get('assignmentId',''));answer=str(data.get('answer','')).strip()[:5000];self_check=str(data.get('selfCheck',''))[:40]
                assignment=c.execute('''SELECT a.* FROM assignments a JOIN class_members m ON m.class_id=a.class_id
                                      WHERE a.id=? AND m.student_id=?''',(assignment_id,user['id'])).fetchone()
                if not assignment: return self.send_json({'error':'No tienes acceso a esa tarea.'},403)
                if len(answer)<2:return self.send_json({'error':'Escribe tu respuesta antes de entregar.'},400)
                old=c.execute('SELECT id,attempts FROM submissions WHERE assignment_id=? AND student_id=?',(assignment_id,user['id'])).fetchone()
                if old:
                    c.execute('UPDATE submissions SET answer=?,self_check=?,attempts=attempts+1,score=NULL,feedback="",submitted_at=CURRENT_TIMESTAMP,graded_at=NULL WHERE id=?',(answer,self_check,old['id']))
                else:
                    c.execute('INSERT INTO submissions(id,assignment_id,student_id,answer,self_check) VALUES(?,?,?,?,?)',(uuid.uuid4().hex,assignment_id,user['id'],answer,self_check))
                c.execute('''INSERT INTO topic_progress(student_id,grade_id,subject,topic_id,attempts) VALUES(?,?,?,?,1)
                             ON CONFLICT(student_id,grade_id,subject,topic_id) DO UPDATE SET attempts=attempts+1,updated=CURRENT_TIMESTAMP''',
                          (user['id'],assignment['grade_id'],assignment['subject'],assignment['topic_id']))
                c.commit();return self.send_json({'ok':True})

            if path == '/api/practice':
                if user['role']!='student':return self.send_json({'error':'Las prácticas requieren una cuenta de estudiante.'},403)
                grade_id=str(data.get('gradeId',''));subject=str(data.get('subject',''));topic_id=str(data.get('topicId',''));title=str(data.get('topicTitle',''))[:150];answer=str(data.get('answer','')).strip()[:5000];check=str(data.get('selfCheck',''))[:40]
                if grade_id not in GRADES or subject not in SUBJECTS or not topic_id or len(answer)<2:return self.send_json({'error':'Completa una respuesta válida para guardar la práctica.'},400)
                c.execute('INSERT INTO practice_attempts(id,student_id,grade_id,subject,topic_id,topic_title,answer,self_check) VALUES(?,?,?,?,?,?,?,?)',(uuid.uuid4().hex,user['id'],grade_id,subject,topic_id,title,answer,check))
                c.execute('''INSERT INTO topic_progress(student_id,grade_id,subject,topic_id,attempts) VALUES(?,?,?,?,1)
                             ON CONFLICT(student_id,grade_id,subject,topic_id) DO UPDATE SET attempts=attempts+1,updated=CURRENT_TIMESTAMP''',(user['id'],grade_id,subject,topic_id))
                c.commit();return self.send_json({'ok':True})

            if path == '/api/quiz-attempt':
                if user['role']!='student':return self.send_json({'error':'Las evaluaciones requieren una cuenta de estudiante.'},403)
                grade_id=str(data.get('gradeId',''));subject=str(data.get('subject',''));topic=str(data.get('topicTitle','Evaluación'))[:150]
                try:
                    score=float(data.get('score',-1));correct=int(data.get('correctCount',0));total=int(data.get('questionCount',0))
                    xp=max(0,min(500,int(data.get('xp',0))));streak=max(0,min(100,int(data.get('bestStreak',0))))
                    duration=max(0,min(86400,int(data.get('durationSeconds',0))))
                except (TypeError,ValueError):return self.send_json({'error':'Los datos de la evaluación no son válidos.'},400)
                if grade_id not in GRADES or subject not in SUBJECTS or not 0<=score<=100 or total<1 or not 0<=correct<=total:
                    return self.send_json({'error':'Verifica materia, grado y resultado de la evaluación.'},400)
                answers=data.get('answers',[])
                if not isinstance(answers,list):answers=[]
                answers_json=json.dumps(answers[:30],ensure_ascii=False)[:12000]
                c.execute('''INSERT INTO quiz_attempts(id,student_id,grade_id,subject,topic_title,score,correct_count,question_count,xp,best_streak,duration_seconds,answers_json)
                             VALUES(?,?,?,?,?,?,?,?,?,?,?,?)''',
                          (uuid.uuid4().hex,user['id'],grade_id,subject,topic,score,correct,total,xp,streak,duration,answers_json))
                quiz_count=c.execute('SELECT COUNT(*) FROM quiz_attempts WHERE student_id=?',(user['id'],)).fetchone()[0]
                possible=[('FIRST_QUIZ','Primer quiz completado',quiz_count>=1),('PERFECT_SCORE','Dominio total: 100%',score>=100),('STREAK_3','Racha de 3 respuestas correctas',streak>=3),('QUIZ_5','Cinco evaluaciones completadas',quiz_count>=5)]
                new_badges=[]
                for code,label,eligible in possible:
                    if eligible:
                        cur=c.execute('INSERT OR IGNORE INTO student_badges(id,student_id,code,label) VALUES(?,?,?,?)',(uuid.uuid4().hex,user['id'],code,label))
                        if cur.rowcount:new_badges.append(label)
                xp_total=c.execute('SELECT COALESCE(SUM(xp),0) FROM quiz_attempts WHERE student_id=?',(user['id'],)).fetchone()[0]
                c.commit();return self.send_json({'ok':True,'message':'Resultado guardado en tu historial.','newBadges':new_badges,'xpTotal':xp_total},201)

            if path == '/api/grade':
                if user['role'] not in ('teacher','admin'):return self.send_json({'error':'Solo docentes autorizados pueden calificar.'},403)
                submission_id=str(data.get('submissionId',''));score=float(data.get('score',-1));feedback=str(data.get('feedback','')).strip()[:1000]
                if not 0<=score<=100:return self.send_json({'error':'La calificación debe estar entre 0 y 100.'},400)
                row=c.execute('''SELECT s.student_id,s.assignment_id,a.grade_id,a.subject,a.topic_id,a.teacher_id,a.class_id FROM submissions s JOIN assignments a ON a.id=s.assignment_id WHERE s.id=?''',(submission_id,)).fetchone()
                if not row or row['teacher_id']!=user['id']:return self.send_json({'error':'Entrega no encontrada o sin autorización.'},403)
                c.execute('UPDATE submissions SET score=?,feedback=?,graded_at=CURRENT_TIMESTAMP WHERE id=?',(score,feedback,submission_id))
                best=c.execute('''SELECT MAX(s.score) FROM submissions s JOIN assignments a ON a.id=s.assignment_id
                                  WHERE s.student_id=? AND a.grade_id=? AND a.subject=? AND a.topic_id=?''',
                               (row['student_id'],row['grade_id'],row['subject'],row['topic_id'])).fetchone()[0]
                c.execute('''INSERT INTO topic_progress(student_id,grade_id,subject,topic_id,best_score,mastered)
                             VALUES(?,?,?,?,?,?) ON CONFLICT(student_id,grade_id,subject,topic_id)
                             DO UPDATE SET best_score=?,mastered=?,updated=CURRENT_TIMESTAMP''',
                          (row['student_id'],row['grade_id'],row['subject'],row['topic_id'],best,int(best>=80),best,int(best>=80)))
                c.commit();return self.send_json({'ok':True,'mastered':best>=80})

            return self.send_json({'error':'Ruta no encontrada.'},404)
        except sqlite3.IntegrityError:
            c.rollback();return self.send_json({'error':'Ese usuario o registro ya existe.'},409)
        except (TypeError,ValueError):
            c.rollback();return self.send_json({'error':'Revisa los datos enviados.'},400)
        finally:
            c.close()

    def do_GET(self):
        parsed=urllib.parse.urlparse(self.path);path=parsed.path;query=urllib.parse.parse_qs(parsed.query)
        c=connect()
        try:
            if path.startswith('/api/'):
                # Public check lets the login screen tell a first-time user how to begin.
                if path == '/api/setup-status':
                    count=c.execute('SELECT COUNT(*) FROM players').fetchone()[0]
                    return self.send_json({'hasAccounts':count>0,'accountCount':count})
                token=query.get('token',[''])[0];user=self.get_user(c,token)
                if not user:return
                if path=='/api/state':return self.send_json({'user':safe_user(user)})
                if path=='/api/admin/users':
                    if user['role']!='admin':return self.send_json({'error':'Solo administración puede gestionar cuentas.'},403)
                    rows=c.execute('SELECT * FROM players ORDER BY created DESC').fetchall()
                    return self.send_json({'users':[safe_user(r) for r in rows]})
                if path=='/api/classes':
                    if user['role'] in ('teacher','admin'):
                        rows=c.execute('''SELECT cl.*,(SELECT COUNT(*) FROM class_members m WHERE m.class_id=cl.id) member_count,
                              (SELECT COUNT(*) FROM assignments a WHERE a.class_id=cl.id) assignment_count
                              FROM classes cl WHERE cl.teacher_id=? ORDER BY cl.created DESC''',(user['id'],)).fetchall()
                    else:
                        rows=c.execute('''SELECT cl.*,p.name teacher_name,(SELECT COUNT(*) FROM assignments a WHERE a.class_id=cl.id) assignment_count
                              FROM classes cl JOIN class_members m ON m.class_id=cl.id JOIN players p ON p.id=cl.teacher_id
                              WHERE m.student_id=? ORDER BY cl.name''',(user['id'],)).fetchall()
                    return self.send_json({'classes':[dict(r) for r in rows]})
                if path=='/api/class':
                    class_id=query.get('id',[''])[0]
                    cl=c.execute('SELECT cl.*,p.name AS teacher_name FROM classes cl JOIN players p ON p.id=cl.teacher_id WHERE cl.id=?',(class_id,)).fetchone()
                    if not cl:return self.send_json({'error':'Clase no encontrada.'},404)
                    is_teacher=user['id']==cl['teacher_id'] and user['role'] in ('teacher','admin')
                    is_member=c.execute('SELECT 1 FROM class_members WHERE class_id=? AND student_id=?',(class_id,user['id'])).fetchone()
                    if not is_teacher and not is_member:return self.send_json({'error':'No tienes acceso a esta clase.'},403)
                    members=c.execute('''SELECT p.id,p.username,p.name,p.grade_id FROM class_members m JOIN players p ON p.id=m.student_id WHERE m.class_id=? ORDER BY p.name''',(class_id,)).fetchall()
                    assignments=c.execute('SELECT * FROM assignments WHERE class_id=? ORDER BY due_date IS NULL,due_date,created DESC',(class_id,)).fetchall()
                    if is_teacher:
                        submissions=c.execute('''SELECT s.*,p.name student_name,a.title assignment_title,a.topic_id,a.subject,a.grade_id
                          FROM submissions s JOIN players p ON p.id=s.student_id JOIN assignments a ON a.id=s.assignment_id
                          WHERE a.class_id=? ORDER BY s.submitted_at DESC''',(class_id,)).fetchall()
                        quizzes=c.execute('''SELECT q.id,q.grade_id,q.subject,q.topic_title,q.score,q.correct_count,q.question_count,q.xp,q.best_streak,q.duration_seconds,q.created,p.name student_name FROM quiz_attempts q
                          JOIN class_members m ON m.student_id=q.student_id JOIN players p ON p.id=q.student_id
                          WHERE m.class_id=? AND q.grade_id=? ORDER BY q.created DESC LIMIT 200''',(class_id,cl['grade_id'])).fetchall()
                    else:
                        submissions=c.execute('''SELECT s.*,a.title assignment_title,a.topic_id,a.subject,a.grade_id
                          FROM submissions s JOIN assignments a ON a.id=s.assignment_id WHERE a.class_id=? AND s.student_id=? ORDER BY s.submitted_at DESC''',(class_id,user['id'])).fetchall()
                        quizzes=c.execute('''SELECT id,grade_id,subject,topic_title,score,correct_count,question_count,xp,best_streak,duration_seconds,created
                          FROM quiz_attempts WHERE student_id=? AND grade_id=? ORDER BY created DESC LIMIT 100''',(user['id'],cl['grade_id'])).fetchall()
                    return self.send_json({'class':dict(cl),'members':[dict(r) for r in members],
                                           'assignments':[dict(r) for r in assignments],
                                           'submissions':[dict(r) for r in submissions],
                                           'quizAttempts':[dict(r) for r in quizzes],'teacher':is_teacher})
                if path=='/api/progress':
                    rows=c.execute('''SELECT * FROM topic_progress WHERE student_id=? ORDER BY updated DESC''',(user['id'],)).fetchall()
                    practices=c.execute('''SELECT * FROM practice_attempts WHERE student_id=? ORDER BY submitted_at DESC LIMIT 100''',(user['id'],)).fetchall()
                    quizzes=c.execute('''SELECT id,grade_id,subject,topic_title,score,correct_count,question_count,xp,best_streak,duration_seconds,created
                                         FROM quiz_attempts WHERE student_id=? ORDER BY created DESC LIMIT 100''',(user['id'],)).fetchall()
                    badges=c.execute('SELECT code,label,created FROM student_badges WHERE student_id=? ORDER BY created',(user['id'],)).fetchall()
                    xp_total=c.execute('SELECT COALESCE(SUM(xp),0) FROM quiz_attempts WHERE student_id=?',(user['id'],)).fetchone()[0]
                    return self.send_json({'progress':[dict(r) for r in rows],'practices':[dict(r) for r in practices],
                                           'quizzes':[dict(r) for r in quizzes],'badges':[dict(r) for r in badges],'xpTotal':xp_total})
                return self.send_json({'error':'Ruta no encontrada.'},404)
            public={'/':'/index.html','/index.html':'/index.html','/app.js':'/app.js','/styles.css':'/styles.css','/activity-engine.js':'/activity-engine.js'}
            if path not in public:return self.send_json({'error':'Ruta no encontrada.'},404)
            self.path=public[path]
            return super().do_GET()
        finally:c.close()

if __name__=='__main__':
    connect().close()
    print('EduPlay disponible en http://localhost:8000')
    ThreadingHTTPServer(('127.0.0.1',8000),Handler).serve_forever()
