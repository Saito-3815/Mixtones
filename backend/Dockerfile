FROM ruby:3.3.0

ARG RUBYGEMS_VERSION=3.5.3

# RUN mkdir /api

# vimをインストールするために追加
RUN apt-get update -qq && \
    apt-get install -y vim && \
    mkdir /api

WORKDIR /api

COPY Gemfile /api/Gemfile

COPY Gemfile.lock /api/Gemfile.lock

RUN gem update --system ${RUBYGEMS_VERSION} && \
    bundle install

COPY . /api

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["rails", "server", "-b", "0.0.0.0"]

# CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
