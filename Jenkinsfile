#!groovy
def artUploadServer = Artifactory.server('devcloud')
def Snapshot = 'APM-AWS'
def imageName = 'apphub-microapp-seed'
def orgName = 'predix-apphub'
/**
 *
 */
pipeline {
  agent none
	environment {
		DEBUG = ''
    ORG_NAME = 'Predix-Apphub'
    APP_NAME = 'apphub-microapp-seed'
	}
  stages {
    stage('Build & Test') {
      agent {
        docker {
          //image 'registry.gear.ge.com/dig-propel/predixci-node6.9-base'
          image 'node:10'
          label 'dind'
        }
      }
      steps {
        echo 'Running ${BUILD_ID} on ${JENKINS_URL}'
        sh 'printenv'

        echo 'Setting npm config'
        sh """
          node -v
          npm -v
          npm config set strict-ssl false
          npm config ls

        """

        echo 'Installing...'
        sh 'npm ci'

        echo 'Testing...'
        sh 'npm test -- --ci'

        echo 'Building...'
        sh 'npm run dist; cp apphub-microapp-seed-1.0.0.zip apphub-microapp-seed-${BUILD_ID}.zip'
      }
      post {
        success {
          echo 'Build and Test stage completed'
          stash includes: '*.zip', name: 'artifact'
        }
        failure {
          echo 'Build and unit stage failed'
        }
      }
    }
    stage('Publish Artifacts') {
      agent {
        docker {
          image 'registry.gear.ge.com/dig-propel/jfrog-cli-go'
          label 'dind'
        }
      }
      steps {
        script {
          echo 'Publishing Artifacts to Artifactory'
          unstash 'artifact'
          def uploadSpec = """{
            "files": [{
                "pattern": "*.zip",
                "target": "${Snapshot}/build/${ORG_NAME}/${APP_NAME}/${BRANCH_NAME}/${BUILD_NUMBER}/"
            }]
          }"""
          def buildInfo = artUploadServer.upload(uploadSpec)
             artUploadServer.publishBuildInfo(buildInfo)
        }
     }
     post {
       success {
         echo 'Deploy Artifact to Artifactory stage completed'
       }
       failure {
         echo 'Deploy Artifact to Artifactory stage failed'
       }
     }
   }

   stage ('Publish docker to registry') {
      agent {
          label "dind"
      }
      when {
          anyOf {
              branch 'develop'
              branch 'master'
          }
      }

      environment {
          DTR_CREDS = credentials('JS_DTR_CREDENTIALS')
      }

      steps {
          script{
              checkout scm
              if(env.BRANCH_NAME == 'develop'){
                  sh 'docker login https://registry.gear.ge.com -u $DTR_CREDS_USR -p $DTR_CREDS_PSW'
                  sh "docker build -t registry.gear.ge.com/${orgName}/${imageName}:dev --build-arg NODE_TLS_REJECT_UNAUTHORIZED=0 ."
                  sh "docker push registry.gear.ge.com/${orgName}/${imageName}:dev"
              }
              if(env.BRANCH_NAME == 'master'){
                  sh 'docker login https://registry.gear.ge.com -u $DTR_CREDS_USR -p $DTR_CREDS_PSW'
                  sh "docker build -t registry.gear.ge.com/${orgName}/${imageName}:latest --build-arg NODE_TLS_REJECT_UNAUTHORIZED=0 ."
                  sh "docker push registry.gear.ge.com/${orgName}/${imageName}:latest"
              }
          }
      }

      post {
          success {
              echo "Build Docker Image stage completed"
          }
          failure {
              echo "Build Docker Image stage failed"
          }
          }
      }

    stage('Deploy to CF3 Dev'){
      when {
        branch 'master'
      }
      agent {
        docker {
          image 'registry.gear.ge.com/spartans/spartans-cicd'
          label 'dind'
        }
      }

      environment {
        DEVLOGIN = credentials('CF3Dev_Credentials')
        GIT_TOKEN = credentials('GITTOKEN');


        CF_ENV='dev';
        CF_REGION='aws-usw02';
        CF_SPACE='dev';
        CF_DOMAIN="https://api.system.aws-usw02-${CF_ENV}.ice.predix.io";
        CF_RUN_DOMAIN="run.${CF_REGION}-${CF_ENV}.ice.predix.io";
        CF_ORG='predix-apphub';

        //APP_NAME='ui-app-hub';
        APP_VERSION='1.0.0';
        APP_PATH="${APP_NAME}-${BUILD_NUMBER}.zip";
        PUBLISHED_HOST="${APP_NAME}";

        DOMAIN="run.${CF_REGION}-${CF_ENV}.ice.predix.io";
        INSTANCES='2';
        DISK_QUOTA='512M';
        MEMORY='1G';
        SERVICES='predix-logging';
        BUILD_PACK='https://github.com/heroku/heroku-buildpack-nodejs';
        WILD_CARD=''
        TO_ENV='DEV';
      }
      steps {
        dir('build-scripts') {
          git url: "https://$GIT_TOKEN_PSW:x-oauth-basic@github.build.ge.com/predix-apphub/build-scripts.git"
        }
        cfDeploy("${CF_DOMAIN}","$DEVLOGIN_USR","$DEVLOGIN_PSW","${CF_ORG}","${CF_SPACE}")
      }

      post {
        success {
          echo "Deploy stage completed"
        }
        failure {
          echo "Deploy stage failed"
        }
      }
    }
      stage('Deploy to Stage'){
            when {
              branch 'master'
            }

              agent {
                  docker {
                      image 'registry.gear.ge.com/spartans/spartans-cicd'
                      label 'dind'
                  }
              }

              environment {
                  STAGELOGIN = credentials('CF3Stage_Credentials')
                  GIT_TOKEN = credentials('GITTOKEN');

                  CF_ENV='dev';
                  CF_REGION='aws-usw02';
                  CF_SPACE='predix-apphub-stage';
                  CF_DOMAIN="https://api.system.aws-usw02-${CF_ENV}.ice.predix.io";
                  CF_RUN_DOMAIN="run.${CF_REGION}-${CF_ENV}.ice.predix.io";
                  CF_ORG='predix-apphub-stage';

                  //APP_NAME='ui-app-hub';
                  APP_VERSION='1.0.0';
                  APP_PATH="${APP_NAME}-${BUILD_NUMBER}.zip";
                  PUBLISHED_HOST="${APP_NAME}-stage";

                  DOMAIN="run.${CF_REGION}-${CF_ENV}.ice.predix.io";
                  INSTANCES='2';
                  DISK_QUOTA='512M';
                  MEMORY='1G';
                  SERVICES='';
                  BUILD_PACK='https://github.com/heroku/heroku-buildpack-nodejs';
                  WILD_CARD=''

                  TO_ENV='STAGE';
              }

              steps {
                  dir('build-scripts') {
                      git url: "https://$GIT_TOKEN_PSW:x-oauth-basic@github.build.ge.com/predix-apphub/build-scripts.git"
                  }
                  cfDeploy("${CF_DOMAIN}","$STAGELOGIN_USR","$STAGELOGIN_PSW","${CF_ORG}","${CF_SPACE}")
              }

              post {
                  success {
                       echo "Deploy stage completed"
                  }
                  failure {
                      echo "Deploy stage failed"
                  }
              }
          }

          stage('Clean Up') {
              agent {
                  label 'dind'
              }

              steps {
                  step([$class: 'WsCleanup'])
              }

              post {
                   success {
                       echo 'Clean up stage completed'
                   }
                   failure {
                       echo 'Clean up stage failed'
                   }
               }
           }
  }

  /**
   * Steps to always run.
   */
	post {
    always {
      echo 'Done.'
    }
  }
}

  def cfDeploy(String domain, String user, String password, String org, String space) {
  	echo "Pushing to ORG: ${org} SPACE: ${space}"
      unstash 'artifact'

  	sh "cf login -a ${domain} -u ${user} -p ${password} -o ${org} -s ${space}"
  	sh("chmod +x ./build-scripts/script/deploy_sequence.sh")
  	sh("./build-scripts/script/deploy_sequence.sh")
  }
