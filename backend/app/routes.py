from flask import Blueprint, jsonify, request
from app.models import Quiz, QuizResult
from app.database import db
from datetime import datetime
import random

api = Blueprint('api', __name__)

@api.route('/quizzes', methods=['GET'])
def get_quizzes():
    user_id = request.args.get('user_id', type=int)
    quizzes = Quiz.query.all()
    
    result = []
    for quiz in quizzes:
        # Get last res
        user_result = QuizResult.query.filter_by(
            user_id=user_id,
            quiz_id=quiz.id
        ).order_by(QuizResult.completed_at.desc()).first()
        
        result.append({
            'id': quiz.id,
            'title': quiz.title,
            'description': quiz.description,
            'userScore': user_result.score if user_result else 0,
            'is_repassable': quiz.is_repassable
        })
    
    return jsonify(result)

@api.route('/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    questions = quiz.questions.copy()  
    
    # Randomize question order
    random.shuffle(questions)
    
    # Randomize options
    for q in questions:
        if q['type'] == 'multiple-choice':
            options = list(zip(range(len(q['options'])), q['options']))
            random.shuffle(options)
            
            # Update correct answers based on new option positions
            index_map = {old: new for new, (old, _) in enumerate(options)}
            q['options'] = [opt for _, opt in options]
            
            if q.get('multiSelect'):
                q['correctAnswers'] = [index_map[i] for i in q['correctAnswers']]
            else:
                q['correctAnswer'] = index_map[q['correctAnswer']]
    
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'questions': questions,
        'is_repassable': quiz.is_repassable
    })

@api.route('/quiz/<int:quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.get_json()
    user_id = data.get('user_id')
    percentage_score = data.get('score')
    answers = data.get('answers')
    
    quiz = Quiz.query.get_or_404(quiz_id)
    existing_result = QuizResult.query.filter_by(
        user_id=user_id,
        quiz_id=quiz_id
    ).first()
    
    if existing_result:
        if not quiz.is_repassable:
            
            return jsonify({
                'message': 'Quiz already completed',
                'score': existing_result.score,
                'is_repassable': quiz.is_repassable
            })
        
        
        if percentage_score > existing_result.score:
            existing_result.score = percentage_score
            existing_result.answers = answers
            existing_result.completed_at = datetime.utcnow()
    else:
        
        result = QuizResult(
            user_id=user_id,
            quiz_id=quiz_id,
            score=percentage_score,
            answers=answers
        )
        db.session.add(result)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Quiz result saved successfully',
        'score': percentage_score,
        'is_repassable': quiz.is_repassable
    })

@api.route('/quiz/create', methods=['POST'])
def create_quiz():
    data = request.get_json()
    
    required_fields = ['title', 'description', 'questions']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
        
    quiz = Quiz(
        title=data['title'],
        description=data['description'],
        questions=data['questions'],
        is_repassable=data.get('is_repassable', True) # Dafault = true
    )
    
    db.session.add(quiz)
    db.session.commit()
    
    return jsonify({'message': 'Quiz created successfully', 'id': quiz.id})

@api.route('/export', methods=['GET'])
def export_data():
    quizzes = Quiz.query.all()
    results = QuizResult.query.all()
    
    return jsonify({
        'quizzes': [{
            'id': q.id,
            'title': q.title,
            'description': q.description,
            'questions': q.questions,
            'created_at': q.created_at.isoformat()
        } for q in quizzes],
        'results': [{
            'id': r.id,
            'user_id': r.user_id,
            'quiz_id': r.quiz_id,
            'score': r.score,
            'answers': r.answers,
            'completed_at': r.completed_at.isoformat()
        } for r in results]
    }) 