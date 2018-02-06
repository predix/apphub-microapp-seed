#!groovy
def artUploadServer = Artifactory.server('devcloud')
def Snapshot = 'PREDIX'
/**
 *
 */
pipeline {
  agent none
	environment {
		DEBUG = ''
    CACHING_REPO_URL = 'https://repo.ci.build.ge.com/artifactory/api/npm/npm-virtual/'
    ORG_NAME = 'Predix-Apphub'
    APP_NAME = 'apphub-microapp-seed'
	}
  stages {
    stage('Build & Test') {
      agent {
        docker {
          //image 'repo.ci.build.ge.com:8443/predixci-node6.9-base'
          image 'node:8'
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
          npm config set registry $CACHING_REPO_URL
          npm config ls
        """

        echo 'Installing...'
        sh 'npm install'

        echo 'Testing...'
        sh 'npm test'

        echo 'Building...'
        sh 'npm run dist'
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
    /**
     * Publish Artifacts will take the .zip from the build task
     * and upload to artifactory.
     */
    stage('Publish Artifacts') {
      agent {
        docker {
          image 'repo.ci.build.ge.com:8443/jfrog-cli-go'
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
          def downloadSpec = """{
           "files": [
            {
                "pattern": "bazinga-repo/*.zip",
                "target": "bazinga/"
              }
           ]
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
   /**
    * Deploy stage will take the artifact from the build step and push to Cloud Foundry
    */
    stage('Deploy to CF3 Dev'){
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
        PUBLISHED_HOST="${APP_NAME}-${CF_ENV}";

        DOMAIN="run.${CF_REGION}-${CF_SPACE}.ice.predix.io";
        INSTANCES='2';
        DISK_QUOTA='125M';
        MEMORY='1G';
        SERVICES='predix-logging';
        BUILD_PACK='https://github.com/heroku/heroku-buildpack-nodejs';
        WILD_CARD="${PUBLISHED_HOST}.run.${CF_REGION}-${CF_ENV}.ice.predix.io";

        TO_ENV='DEV';
      }

      steps {
        unstash 'artifact'
        sh 'ls -la'
        dir('build-scripts') {
          git url: "https://$GIT_TOKEN_PSW:x-oauth-basic@github.build.ge.com/predix-apphub/build-scripts.git"
        }
        sh "cf login -a ${CF_DOMAIN} -u $DEVLOGIN_USR -p $DEVLOGIN_PSW -o ${CF_ORG} -s ${CF_SPACE}"
        sh("chmod +x ./build-scripts/script/deploy_sequence.sh")
        sh("./build-scripts/script/deploy_sequence.sh")
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
