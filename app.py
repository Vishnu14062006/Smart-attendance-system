from flask import Flask, render_template,request
import qrcode
from datetime import datetime

app = Flask(__name__)
attendance=[]

@app.route('/')
def login():
    return render_template('login1.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard1.html')
  
@app.route('/qr')
def qr():
    from datetime import datetime
    subject = "mathematics"
    data = f"https://oncogenic-monserrate-nonenticing.ngrok-free.dev/scan?time={datetime.now().strftime('%H:%M:%S')}&subject={subject}"
    print(data)
    img = qrcode.make(data)

    path = "static/qr.png"
    img.save(path)

    return render_template('qr.html', qr_image=path,subject=subject) 

from datetime import datetime

@app.route('/scan', methods=['GET', 'POST'])
def scan():

    if request.method == 'POST':
        student_id = request.form.get('student_id')

        # ✅ FIX HERE
        subject = request.args.get('subject')

        attendance.append({
            "student": student_id,
            "subject": subject
        })

        return render_template("success.html", student_id=student_id, subject=subject)

    # GET request
    time = request.args.get('time')
    subject = request.args.get('subject')

    return render_template('scan.html', time=time, subject=subject)

@app.route('/profile')
def profile():
    student = {
        "name": "VISHNUVARDHAN S",
        "gender": "Male",
        "dob": "14-Jun-2006",
        "reg_no": "RA2411003020555",
        "institution": "SRM Institute of Science and Technology",
        "program": "B.Tech Computer Science and Engineering",
        "semester": "III Semester"
    }

    return render_template("profile.html", student=student)

@app.route('/attendance')
def view_attendance():
    return render_template('Attendance1.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)