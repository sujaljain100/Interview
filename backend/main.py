import os
import json

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    status
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from sqlalchemy.orm import Session

from google import genai

from database import (
    engine,
    Base,
    get_db
)

from models import User

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()


GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)


if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file"
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="InterviewIQ API",
    description="AI Powered Mock Interview Platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

FRONTEND_URL = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https://interviewiq1\\.onrender\\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================


class InterviewRequest(BaseModel):

    role: str
    experience: str
    type: str
    difficulty: str


class AnswerEvaluationRequest(BaseModel):

    role: str
    experience: str
    interview_type: str
    difficulty: str
    question: str
    answer: str


class SignupRequest(BaseModel):

    name: str
    email: str
    password: str


class LoginRequest(BaseModel):

    email: str
    password: str


# ============================================================
# LABELS
# ============================================================


ROLE_LABELS = {

    "python": "Python Developer",

    "java": "Java Developer",

    "frontend": "Frontend Developer",

    "backend": "Backend Developer",

    "fullstack": "Full Stack Developer",

    "data-scientist": "Data Scientist",

    "ml-engineer": "Machine Learning Engineer",

    "mathematics": "Mathematics",

    "physics": "Physics",

    "chemistry": "Chemistry",
}


EXPERIENCE_LABELS = {

    "fresher": "Fresher",

    "junior": "0 - 2 Years",

    "mid": "2 - 5 Years",

    "senior": "5+ Years",
}


TYPE_LABELS = {

    "technical": "Technical Interview",

    "dsa": "DSA & Problem Solving",

    "hr": "HR & Behavioral",

    "ai-ml": "AI / ML Interview",

    "sql": "SQL & Database",

    "conceptual": "Conceptual Interview",

    "numerical": "Numerical & Problem Solving",

    "reasoning": "Mathematical Reasoning",

    "applied": "Applied Subject Interview",
}


DIFFICULTY_LABELS = {

    "easy": "Easy",

    "medium": "Medium",

    "hard": "Hard",
}


# ============================================================
# HOME
# ============================================================


@app.get("/")
def home():

    return {
        "message": "InterviewIQ Backend is running!"
    }


# ============================================================
# HEALTH CHECK
# ============================================================


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "InterviewIQ API"
    }


# ============================================================
# SIGNUP
# ============================================================


@app.post("/api/auth/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):

    name = data.name.strip()

    email = data.email.strip().lower()

    password = data.password


    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not name:

        raise HTTPException(
            status_code=400,
            detail="Name is required."
        )


    if len(name) < 2:

        raise HTTPException(
            status_code=400,
            detail="Name must contain at least 2 characters."
        )


    if not email or "@" not in email:

        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address."
        )


    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )


    # --------------------------------------------------------
    # CHECK EXISTING USER
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )


    # --------------------------------------------------------
    # HASH PASSWORD
    # --------------------------------------------------------

    password_hash = hash_password(
        password
    )


    # --------------------------------------------------------
    # CREATE USER
    # --------------------------------------------------------

    new_user = User(
        name=name,
        email=email,
        password_hash=password_hash
    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    # --------------------------------------------------------
    # CREATE TOKEN
    # --------------------------------------------------------

    access_token = create_access_token(
        new_user.id
    )


    return {

        "success": True,

        "message": "Account created successfully.",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": new_user.id,

            "name": new_user.name,

            "email": new_user.email
        }
    }


# ============================================================
# LOGIN
# ============================================================


@app.post("/api/auth/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    email = data.email.strip().lower()

    password = data.password


    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )


    # --------------------------------------------------------
    # VERIFY PASSWORD
    # --------------------------------------------------------

    password_valid = verify_password(
        password,
        user.password_hash
    )


    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )


    # --------------------------------------------------------
    # CREATE JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        user.id
    )


    return {

        "success": True,

        "message": "Login successful.",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email
        }
    }


# ============================================================
# CURRENT USER
# ============================================================


@app.get("/api/auth/me")
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):

    return {

        "success": True,

        "user": {

            "id": current_user.id,

            "name": current_user.name,

            "email": current_user.email
        }
    }


# ============================================================
# INTERVIEW QUESTIONS
# ============================================================


@app.post("/api/interview/questions")
def generate_questions(
    data: InterviewRequest
):

    role = ROLE_LABELS.get(
        data.role,
        data.role
    )

    experience = EXPERIENCE_LABELS.get(
        data.experience,
        data.experience
    )

    interview_type = TYPE_LABELS.get(
        data.type,
        data.type
    )

    difficulty = DIFFICULTY_LABELS.get(
        data.difficulty,
        data.difficulty
    )


    # --------------------------------------------------------
    # DOMAIN-SPECIFIC INSTRUCTIONS
    # --------------------------------------------------------

    domain_instruction = ""


    if data.role == "mathematics":

        domain_instruction = """

This is a Mathematics interview.

Focus on:

- Mathematical concepts
- Formulas and principles
- Logical reasoning
- Numerical problem solving
- Step-by-step mathematical thinking
- Appropriate mathematical terminology

Do not turn the interview into a programming interview.

Questions should genuinely test Mathematics knowledge.

"""


    elif data.role == "physics":

        domain_instruction = """

This is a Physics interview.

Focus on:

- Physics concepts
- Laws and principles
- Physical reasoning
- Numerical problems
- Real-world applications
- Units and relationships between physical quantities

Do not turn the interview into a programming interview.

Questions should genuinely test Physics knowledge.

"""


    elif data.role == "chemistry":

        domain_instruction = """

This is a Chemistry interview.

Focus on:

- Chemistry concepts
- Chemical reactions
- Atomic and molecular concepts
- Periodic properties
- Organic, inorganic and physical chemistry where appropriate
- Numerical chemistry problems where appropriate
- Practical and laboratory understanding

Do not turn the interview into a programming interview.

Questions should genuinely test Chemistry knowledge.

"""


    else:

        domain_instruction = """

This is a Technology/Computer Science interview.

Focus on:

- Role-specific technical knowledge
- Programming concepts where appropriate
- Problem solving
- Practical software development knowledge
- Industry-relevant concepts

"""


    # --------------------------------------------------------
    # GEMINI PROMPT
    # --------------------------------------------------------

    prompt = f"""

You are an expert interviewer for InterviewIQ.

Generate exactly 8 interview questions.

Interview configuration:

Role / Subject: {role}

Experience Level: {experience}

Interview Type: {interview_type}

Difficulty: {difficulty}


{domain_instruction}


Additional rules:

- Generate exactly 8 questions.
- Every question must be relevant to the selected role or subject.
- Match the candidate's experience level.
- Match the selected interview type.
- Match the selected difficulty.
- Do not repeat questions.
- Questions should gradually increase in difficulty.
- Include practical questions where appropriate.
- Questions should feel like realistic interview questions.
- Do not provide answers.
- Do not provide explanations.
- Do not include question numbers outside the JSON.
- Return ONLY valid JSON.


Return exactly this structure:

{{
    "questions": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5",
        "Question 6",
        "Question 7",
        "Question 8"
    ]
}}

"""


    models = [

        "gemini-3.5-flash-lite",

        "gemini-3.5-flash",

        "gemini-2.5-flash",

    ]


    last_error = None


    for model in models:

        try:

            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )


            text = response.text.strip()


            if text.startswith("```json"):

                text = text[7:]


            elif text.startswith("```"):

                text = text[3:]


            if text.endswith("```"):

                text = text[:-3]


            text = text.strip()


            result = json.loads(text)


            questions = result.get(
                "questions",
                []
            )


            if not isinstance(
                questions,
                list
            ):

                raise ValueError(
                    "Invalid questions format."
                )


            if len(questions) != 8:

                raise ValueError(
                    "Gemini did not generate exactly 8 questions."
                )


            return {

                "success": True,

                "questions": questions

            }


        except Exception as error:

            last_error = error

            error_text = str(error)


            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
            ):

                continue


            break


    raise HTTPException(

        status_code=503,

        detail=(
            "Unable to generate interview questions. "
            f"Gemini error: {last_error}"
        )

    )


# ============================================================
# ANSWER EVALUATION
# ============================================================


@app.post("/api/interview/evaluate")
def evaluate_answer(
    data: AnswerEvaluationRequest
):

    role = ROLE_LABELS.get(
        data.role,
        data.role
    )

    experience = EXPERIENCE_LABELS.get(
        data.experience,
        data.experience
    )

    interview_type = TYPE_LABELS.get(
        data.interview_type,
        data.interview_type
    )

    difficulty = DIFFICULTY_LABELS.get(
        data.difficulty,
        data.difficulty
    )


    # --------------------------------------------------------
    # DOMAIN-SPECIFIC EVALUATION
    # --------------------------------------------------------

    evaluation_instruction = ""


    if data.role == "mathematics":

        evaluation_instruction = """

Evaluate this as a Mathematics interview answer.

Pay special attention to:

- Mathematical correctness
- Correct use of formulas
- Logical reasoning
- Step-by-step solution
- Accuracy of calculations
- Understanding of the underlying concept

Do not judge it as a programming answer.

"""


    elif data.role == "physics":

        evaluation_instruction = """

Evaluate this as a Physics interview answer.

Pay special attention to:

- Correct physics concepts
- Laws and principles
- Physical reasoning
- Correct formulas
- Units and dimensions
- Numerical accuracy
- Real-world interpretation

Do not judge it as a programming answer.

"""


    elif data.role == "chemistry":

        evaluation_instruction = """

Evaluate this as a Chemistry interview answer.

Pay special attention to:

- Chemical correctness
- Concepts and principles
- Chemical equations/reactions where relevant
- Terminology
- Numerical accuracy where applicable
- Practical/laboratory understanding

Do not judge it as a programming answer.

"""


    else:

        evaluation_instruction = """

Evaluate this as a Technology/Computer Science interview answer.

Pay special attention to:

- Technical correctness
- Programming concepts
- Problem solving
- Practical understanding
- Role-specific knowledge

"""


    # --------------------------------------------------------
    # GEMINI EVALUATION PROMPT
    # --------------------------------------------------------

    prompt = f"""

You are a professional interviewer evaluating a candidate
for the InterviewIQ AI mock interview platform.


Candidate interview details:

Role / Subject: {role}

Experience: {experience}

Interview Type: {interview_type}

Difficulty: {difficulty}


Interview Question:

{data.question}


Candidate Answer:

{data.answer}


{evaluation_instruction}


Evaluate the candidate's answer fairly.

Consider:

1. Correctness
2. Relevance to the question
3. Clarity
4. Completeness
5. Practical understanding
6. Communication quality

For numerical or problem-solving questions,
evaluate the reasoning and final result.

For conceptual questions,
evaluate the candidate's understanding.


Return ONLY valid JSON.


Use this exact format:

{{
    "score": 0,
    "strengths": [
        "strength 1",
        "strength 2"
    ],
    "weaknesses": [
        "weakness 1",
        "weakness 2"
    ],
    "feedback": "Detailed feedback about the answer.",
    "improvement": "Specific advice to improve the answer.",
    "ideal_answer": "A concise example of what a strong answer could contain."
}}


Score must be a number from 0 to 10.

Do not be unnecessarily harsh.

Do not give a high score simply because the answer is long.

Focus on the actual quality and correctness of the answer.

"""


    models = [

        "gemini-3.5-flash-lite",

        "gemini-3.5-flash",

        "gemini-2.5-flash",

    ]


    last_error = None


    for model in models:

        try:

            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )


            text = response.text.strip()


            if text.startswith("```json"):

                text = text[7:]


            elif text.startswith("```"):

                text = text[3:]


            if text.endswith("```"):

                text = text[:-3]


            text = text.strip()


            result = json.loads(text)


            score = float(
                result.get(
                    "score",
                    0
                )
            )


            score = max(
                0,
                min(10, score)
            )


            return {

                "success": True,

                "evaluation": {

                    "score": score,

                    "strengths": result.get(
                        "strengths",
                        []
                    ),

                    "weaknesses": result.get(
                        "weaknesses",
                        []
                    ),

                    "feedback": result.get(
                        "feedback",
                        ""
                    ),

                    "improvement": result.get(
                        "improvement",
                        ""
                    ),

                    "ideal_answer": result.get(
                        "ideal_answer",
                        ""
                    ),

                }

            }


        except Exception as error:

            last_error = error

            error_text = str(error)


            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
            ):

                continue


            break


    raise HTTPException(

        status_code=503,

        detail=(
            "Unable to evaluate the answer. "
            f"Gemini error: {last_error}"
        )

    )