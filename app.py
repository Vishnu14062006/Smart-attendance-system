from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login1.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard1.html')

@app.route('/qr')
def qr():
    return render_template('qr.html')

@app.route('/scan')
def scan():
    return render_template('scan.html')

@app.route('/attendance')
def attendance():
    return render_template('Attendance1.html')

if __name__ == '__main__':
    app.run(debug=True)