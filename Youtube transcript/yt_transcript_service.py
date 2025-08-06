from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
import re

app = Flask(__name__)

def get_video_id(url):
    import urllib.parse
    # Try to extract from v= param first
    parsed = urllib.parse.urlparse(url)
    qs = urllib.parse.parse_qs(parsed.query)
    if 'v' in qs:
        return qs['v'][0]
    # Fallback to regex for youtu.be and embed
    regex = r"(youtu\.be/|embed/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if match:
        return match.group(2)
    raise Exception("Invalid YouTube URL")

@app.route('/api/transcript', methods=['POST'])
def transcript():
    data = request.get_json()
    url = data.get('url')
    print("Received URL:", url)
    try:
        video_id = get_video_id(url)
        # Try multiple languages: English, English (India), Hindi, Bangla
        languages_to_try = ['en', 'en-IN', 'hi', 'bn']
        transcript = None
        for lang in languages_to_try:
            try:
                transcript = YouTubeTranscriptApi().fetch(video_id, languages=[lang])
                break
            except Exception:
                continue
        # If still not found, try without specifying languages (to get auto-generated)
        if not transcript:
            try:
                transcript = YouTubeTranscriptApi().fetch(video_id)
            except Exception:
                raise Exception("Transcript not found in any supported language or as auto-generated.")
        text = " ".join([entry.text for entry in transcript])
        return jsonify({'transcript': text})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)