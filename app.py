from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/input')
def input_page():
    return render_template('input.html')

@app.route('/results')
def results_page():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(debug=True)