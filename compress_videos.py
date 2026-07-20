import os
import subprocess
import glob

ffmpeg_path = r"C:\Users\piyus\Desktop\ffmpeg\bin\ffmpeg.exe"
originals_dir = r"C:\Users\piyus\Desktop\orignals"
output_dir = r"C:\Users\piyus\Roopshree\public\compressed"

os.makedirs(output_dir, exist_ok=True)

mov_files = glob.glob(os.path.join(originals_dir, "*.[mM][oO][vV]"))

print(f"Found {len(mov_files)} original video files to compress.")

for index, mov_file in enumerate(mov_files):
    basename = os.path.splitext(os.path.basename(mov_file))[0]
    output_filename = f"{basename}.mp4"
    output_path = os.path.join(output_dir, output_filename)
    
    print(f"\n[{index+1}/{len(mov_files)}] Compressing and trimming {basename} to 15 seconds...")
    
    cmd = [
        ffmpeg_path,
        "-y",
        "-i", mov_file,
        "-t", "15",                # trim video to first 15 seconds
        "-vf", "scale=-2:720",     # scale to 720p height
        "-c:v", "libx264",         # H.264 video codec
        "-b:v", "1.2M",            # average video bitrate 1.2 Mbps
        "-maxrate", "1.8M",        # max video bitrate
        "-bufsize", "2.4M",        # rate control buffer
        "-preset", "medium",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart", # instant start for web streaming
        output_path
    ]
    
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
            print(f"-> Successfully compressed to {output_filename} ({file_size_mb:.2f} MB)")
        else:
            print(f"-> Failed to compress {basename}. Error:\n{result.stderr}")
    except Exception as e:
        print(f"-> Error running FFmpeg: {str(e)}")

print("\nAll videos processed successfully!")
