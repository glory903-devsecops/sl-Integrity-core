import os
import sys
import subprocess
import platform

def run_command(args, cwd=None, env=None):
    """Run a command as a list of arguments to handle spaces correctly."""
    print(f"Executing: {' '.join(args)}")
    result = subprocess.run(args, cwd=cwd, env=env)
    if result.returncode != 0:
        print(f"Error: Command failed with exit code {result.returncode}")

def main():
    # 1. 고정 경로 설정 (스크립트 파일의 위치로 이동)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"🚀 SL SDF-IP 플랫폼 시작 중... (작업 디렉토리: {script_dir})")

    # 2. 가상환경 경로 설정 (OS별 차이)
    is_windows = platform.system() == "Windows"
    venv_dir = os.path.join(script_dir, "venv")
    
    if is_windows:
        python_exe = os.path.join(venv_dir, "Scripts", "python.exe")
        pip_exe = os.path.join(venv_dir, "Scripts", "pip.exe")
    else:
        python_exe = os.path.join(venv_dir, "bin", "python3")
        pip_exe = os.path.join(venv_dir, "bin", "pip")

    # 3. 가상환경 생성 확인
    if not os.path.exists(venv_dir):
        print("📦 가상환경(venv)을 생성합니다...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])

    # 4. pip 업그레이드 및 패키지 설치
    print("📥 필수 패키지를 설치/업데이트합니다...")
    run_command([python_exe, "-m", "pip", "install", "--upgrade", "pip"])
    run_command([pip_exe, "install", "-r", "requirements.txt"])

    # 5. 서버 실행
    print("\n🌐 서버를 시작합니다... (URL: http://127.0.0.1:8000/docs)")
    
    # PYTHONPATH 설정
    env = os.environ.copy()
    current_path = env.get("PYTHONPATH", "")
    env["PYTHONPATH"] = f"{script_dir}{os.pathsep}{current_path}"

    try:
        # uvicorn 실행 (shell=False/List-mode for safety)
        subprocess.run([python_exe, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"], env=env)
    except KeyboardInterrupt:
        print("\n👋 서버가 종료되었습니다.")

if __name__ == "__main__":
    main()
