from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #http://127.0.0.1:5500
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",        
        password="God&Blay2003",       
        database="Team_Skill_Inventory"
    )

@app.get("/members")
def get_members():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM members")
    members = cursor.fetchall()
    cursor.close()
    db.close()
    return members

@app.delete("/members/{member_id}")
def delete_member(member_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM members WHERE id = %s", (member_id,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Member deleted successfully!"}


@app.post("/members")
def add_member(member: dict):
    name = member.get("name")
    skill = member.get("skill")
    level = member.get("level")

    if not all([name, skill, level]):
        raise HTTPException(status_code=400, detail="Missing fields")

    db = get_db_connection()
    cursor = db.cursor()
    sql = "INSERT INTO members (name, skill, level) VALUES (%s, %s, %s)"
    cursor.execute(sql, (name, skill, level))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Member added successfully!"}


@app.delete("/members/{member_id}")
def delete_member(member_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM members WHERE id = %s", (member_id,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Member deleted successfully!"}
