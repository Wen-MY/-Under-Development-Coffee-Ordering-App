import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser
from flask_cors import CORS

DB = 'usersDB.sqlite'

def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'username': row[1],
        'email': row[2],
        'password': row[3],  
        'balance': row[4],   
    }
    return row_dict

app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    db.close()

    if user and user[3] == password:
        # User authentication successful
        user_dict = get_row_as_dict(user)
        return jsonify({'message': 'Login successful', 'user': user_dict}), 200
    else:
        # Authentication failed
        return jsonify({'message': 'Invalid username or password'}), 401


@app.route('/api/users', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users ORDER BY username')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/users/<int:user>', methods=['GET'])
def show(user):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE id=?', (str(user),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/users', methods=['POST'])
def store():
    if not request.json:
        abort(404)

    new_user = (
        request.json['username'],
        request.json['email'],
        request.json['password']
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO users(username,email,password,balance)
        VALUES(?,?,?,0.00)
    ''', new_user)

    user_id = cursor.lastrowid

    db.commit()

    response = {
        'id': user_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/users/<int:user>', methods=['PUT'])
def update(user):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != user:
        abort(400)

    update_user = (
        request.json['name'],
        request.json['email'],
        request.json['password'],
        request.json['balance'],
        str(user),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE users SET
            name=?,email=?,password=?,balance=?
        WHERE id=?
    ''', update_user)

    db.commit()

    response = {
        'id': user,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/users/<int:user>', methods=['DELETE'])
def delete(user):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != user:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM users WHERE id=?', (str(user),))

    db.commit()

    response = {
        'id': user,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)