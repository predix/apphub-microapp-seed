#!groovy
def artUploadServer = Artifactory.server('devcloud')
def Snapshot = 'PREDIX'

pipeline {
  agent none
	environment {
		DEBUG = ''
    CACHING_REPO_URL = 'https://repo.ci.build.ge.com/artifactory/api/npm/npm-virtual/'
    ORG_NAME = 'Predix-Apphub'
    APP_NAME = 'apphub-microapp-seed'
    ARTIFACT_TARGET = "${Snapshot}/build/${ORG_NAME}/${APP_NAME}/${BRANCH_NAME}/${BUILD_NUMBER}/"
	}
  stages {
    stage('Build') {
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

        sh 'npm config set strict-ssl false'
        sh "npm config set registry $CACHING_REPO_URL"
        sh 'npm config list'

        echo 'Checking versions'
        sh 'node -v'
        sh 'npm -v'

        echo 'Installing...'
        sh 'npm install'

        echo 'Testing...'
        sh 'npm test'

        echo 'Creating Dist'
        sh 'npm run dist'
      }
      post {
        success {
          echo 'Build and unit stage completed'
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
                "target": "${ARTIFACT_TARGET}"
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

   stage('Deploy') {
      steps {
        echo 'Skipping'
      }
    }
  }

  stage('Deploy to CF3Dev'){
    agent {
        docker {
            image 'pivotalpa/cf-cli-resource'
            label 'dind'
        }
    }
    environment {
        DEVLOGIN = credentials('CF3Dev_Credentials')
        CF_DOMAIN='https://api.system.aws-usw02-dev.ice.predix.io';
        CF_RUN_DOMAIN='run.aws-usw02-dev.ice.predix.io';
        CF_ORG='predix-apphub';
        CF_SPACE='dev';
        //CF_USER='predix-web-deployer';
        //CF_PASSWORD='4f9Hv9c@Fxb5Qc';
        BUILD_PACK='https://github.com/heroku/heroku-buildpack-nodejs';
        DOMAIN='run.aws-usw02-dev.ice.predix.io';
        INSTANCES='2';
        DISK_QUOTA='256M';
        MEMORY='1G';
        TO_ENV='AWSDEV';
    }

    steps {
        unstash 'artifact'
        sh 'printenv'
        sh 'uname a'
        //sh "cf login -a ${CF_DOMAIN} -u $DEVLOGIN_USR -p $DEVLOGIN_PSW -o ${CF_ORG} -s ${CF_SPACE}"
        //sh 'cf push'
        //sh 'chmod +x ./build-scripts/script/deploy_sequence.sh'
        //sh './build-scripts/script/deploy_sequence.sh'
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
	post {
    always {
      echo 'Done.'
			//archiveArtifacts artifacts: '*.zip', fingerprint: true
			//junit 'coverage/*.xml'
    }
  }
}
