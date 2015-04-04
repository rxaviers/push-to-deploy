Push-to-Deploy
---

## Why?

This project offers the simplicity of the "[push-to-deploy][]" model Heroku
pioneered. It implements the server that receives webhook events that, in turn,
triggers shell actions to perform the deployment.

[push-to-deploy]: http://krisjordan.com/essays/setting-up-push-to-deploy-with-git

## Install

*By downloading a ZIP or a TAR.GZ...*

Click the github [releases tab](https://github.com/rxaviers/puhs-to-deploy/releases)
and download the latest available push-to-deploy package.

*By using npm package manager...*

    $ npm install push-to-deploy

*By using source files...*

1. `git clone https://github.com/rxaviers/push-to-deploy.git`.
1. Checkout a published/tagged version `git checkout <tag>`.

## Usage

### On your deployment server

Start the server by executing `./bin/push-to-deploy`, optionally set the
listening port (default is 8000), and pass the configuration files.

    $ ./bin/push-to-deploy -p 8000 /etc/deploy.d/*.yml

A configuration file keeps the list of push events and their respective
deployment shell actions. YAML and JSON formats are supported. For example,
`/etc/deploy.d/app.yml`.

```yaml
# On a new master commit, run STAGE deployment.
rxaviers/app/push/heads/master:
  - echo "Running STAGE deployment (checkout out {{commit}})" &&
    cd /srv/stage-app &&
    git fetch origin &&
    git checkout --force {{commit}}
  - echo "Restarting STAGE app" &&
    service stage-app restart

# On a new tag, run LIVE deployment.
rxaviers/app/push/tags/*:
  - echo "Running LIVE deployment (checking out {{tag}})" &&
    cd /srv/app &&
    git fetch origin &&
    git checkout --force {{tag}}
  - echo "Restarting LIVE app" &&
    service app restart
```

The `{{event_data}}` are automatically replaced. For a list of them, see
[scottgonzalez/node-git-notifier][].

[scottgonzalez/node-git-notifier]: https://github.com/scottgonzalez/node-git-notifier#common-event-data


### On your upstream git repository

#### github

If you're using github to host your origin/upstream repository, simply setup a
[webhook service][] to send `push` events to your deployment server.

[webhook service]: https://developer.github.com/webhooks/

#### git --bare

If you're hosting the bare repository yourself, simply create a `post-receive`
hook there for sending webhook `push` events to your deployment server. For
example, by using [metajack/notify-webhook][].

[metajack/notify-webhook]: https://github.com/metajack/notify-webhook

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
