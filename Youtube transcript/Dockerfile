FROM python:3.11-slim

WORKDIR /app

COPY yt_transcript_service.py .

RUN pip install flask youtube-transcript-api

EXPOSE 5001

CMD ["python", "yt_transcript_service.py"]