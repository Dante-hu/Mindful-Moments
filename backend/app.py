from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from flask_jwt_extended import jwt_required #to protect routes, user must log in first
from flask_cors import CORS

'''
    Error/Succesful code defwnintion

    404- 'Not Found error' indicates that a requested page or resource cannot be found on a web server
    401- the server was unable to identify the user because the request lacked valid authentication credentials
    200- Succesful 
    201-Successful and created new resources

'''

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Replace with a secure key
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

#empty database test
users_db = {}


#home route
@app.route('/')
def home():
    return "Welcome to Mindful Moments Backend!"

#register route for users
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print(f"Request data: {data}")  # Debugging statement

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    if username in users_db:
        return jsonify({"message": "User already exists"}), 400

    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    except Exception as e:
        print(f"Error hashing password: {e}")  # Debugging statement
        return jsonify({"message": "Failed to hash password"}), 500

    users_db[username] = {
        "password": hashed_password,
        "mood_logs": []
    }
    print(f"Users DB after registration: {users_db}")
    return jsonify({"message": "User registered successfully"}), 201

#login route for users
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(f"Request data: {data}")  # Debugging statement

    username = data.get('username')
    password = data.get('password')

    print(f"Username: {username}, Password: {password}")  # Debugging statement

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    user = users_db.get(username)
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

#route for log-mood
@app.route('/log-mood', methods=['POST'])
@jwt_required()
def log_mood():
    data = request.json
    print(f"Request data: {data}")  # Debugging statement

    username = data.get('username')
    mood_text = data.get('mood_text')

    if not username or not mood_text:
        return jsonify({"message": "Missing username or mood_text"}), 400

    user = users_db.get(username)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user['mood_logs'].append(mood_text)
    print(f"Updated Users DB: {users_db}")
    return jsonify({"message": "Mood logged successfully"}), 201

#route for specifed user mood history
@app.route('/mood-history/<username>', methods=['GET'])
@jwt_required()
def mood_history(username):
    user = users_db.get(username)
    if not user:
        return jsonify({"message": "User not found"}), 404 

    return jsonify({"mood_logs": user['mood_logs']}), 200

@app.route('/clear-mood-logs/<username>', methods=['POST'])
def clear_mood_logs(username):
    user = users_db.get(username)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user['mood_logs'] = []
    return jsonify({"message": "Mood logs cleared successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)