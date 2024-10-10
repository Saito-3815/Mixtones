FROM ruby:3.3.0

RUN apt-get update -qq && \
    apt-get install -y build-essential \
                        libpq-dev \
                        nodejs \
                        vim \
                        redis-tools

ENV RAILS_ENV=production

RUN mkdir /app

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN gem install bundler
RUN bundle install --without test development

COPY . /app

EXPOSE 3000

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["/bin/sh", "-c", "bundle exec unicorn -p 3000 -c /app/config/unicorn.rb -E production"]
