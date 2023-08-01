FROM ruby:3.1.4-bookworm

ENV BUNDLER_VERSION=2.3.3

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

RUN mv config/sirene.docker.yml config/sirene.yml

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]