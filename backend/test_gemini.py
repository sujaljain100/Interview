import os
import time

from dotenv import load_dotenv
from google import genai


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Check your .env file."
    )


print("API key found.")
print("Connecting to Gemini...")


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(
    api_key=api_key
)


# ==========================================
# MODELS TO TRY
# ==========================================

models = [
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
]


# ==========================================
# TEST PROMPT
# ==========================================

prompt = """
You are helping test an AI interview platform called InterviewIQ.

Reply with exactly:

InterviewIQ Gemini connection successful.
"""


# ==========================================
# TRY MODELS
# ==========================================

for model in models:

    print(f"\nTrying model: {model}")

    try:

        response = client.interactions.create(
            model=model,
            input=prompt
        )

        print("\n==============================")
        print("SUCCESS")
        print("==============================")
        print(f"Model: {model}")
        print("Response:")
        print(response.output_text)
        print("==============================")

        break

    except Exception as e:

        error_message = str(e)

        print("\nModel failed:")
        print(error_message)

        if "503" in error_message or "UNAVAILABLE" in error_message:

            print(
                f"{model} is temporarily unavailable."
            )

            print("Trying the next model...")

            time.sleep(2)

        else:

            print(
                "\nThis does not look like a temporary "
                "model availability problem."
            )

            print("Stopping test.")

            break

else:

    print("\n==============================")
    print("ALL MODELS ARE CURRENTLY UNAVAILABLE")
    print("==============================")
    print(
        "Your API key was loaded successfully, "
        "but Gemini is currently unavailable."
    )