# Use uv base image
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

# Create a non-root user
RUN useradd -m -u 1000 user

# Create a directory for the app and assign ownership
RUN mkdir -p /home/user/app && chown -R user:user /home/user/app

# Switch to non-root user
USER user

# Set working directory
WORKDIR /home/user/app

# Copy app files into container
COPY --chown=user . .

# OPTIONAL: Create and activate venv with uv (only needed if you're not using `uv pip`)
RUN uv venv

# Install dependencies
RUN uv pip install -r requirements.txt

# Run your app
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

