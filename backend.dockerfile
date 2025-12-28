FROM python:3.12
WORKDIR /var/app

# Install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /var/tmp/requirements.txt
RUN pip install -r /var/tmp/requirements.txt

# Install application
COPY ./moviedb.py .
COPY ./classes/*.py ./classes/
COPY ./.env .

# Run application
CMD ["python", "moviedb.py"]