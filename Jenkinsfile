#!groovy

// Define DevCloud Artifactory for publishing non-docker image artifacts
def artUploadServer = Artifactory.server('devcloud')

// Snapshot = DevCloud Artifactory repo name
def Snapshot = 'PREDIX'

pipeline {
  agent none
	environment {
		DEBUG = ''
    APP_NAME = 'apphub-microapp-seed'
    CF_ENDPOINT = "https://api.system.aws-usw02-pr.ice.predix.io"
    CF_ORG = 'jonnie.spratley@ge.com'
    CF_SPACE = 'development'
    CF_USERNAME = credentials('CF_USERNAME');
    CF_PASSWORD = credentials('CF_PASSWORD');
	}
  stages {
    stage('Build') {
      agent {
        docker {
          image 'repo.ci.build.ge.com:8443/predixci-node6.9-base'
          label 'dind'
        }
      }
      environment {
        CACHING_REPO_URL = 'https://repo.ci.build.ge.com/artifactory/api/npm/npm-virtual/'
      }
      steps {
        echo 'Running ${BUILD_ID} on ${JENKINS_URL}'
        sh 'printenv'
        sh "npm config set strict-ssl false"
        sh "npm config set registry $CACHING_REPO_URL"
        sh 'node -v'
        sh 'npm -v'
        echo 'Installing...'
        sh 'npm install'
        sh 'bower install --force-latest --allow-root'
        sh 'npm run dist'
      }
      post {
        success {
          echo 'Build and unit stage completed'
          sh "zip -r ./${APP_NAME}-${env.BUILD_ID}.zip ./build/**"
          stash includes: '*.zip', name: 'artifact'
        }
        failure {
          echo 'Build and unit stage failed'
        }
      }
    }
    stage('Test') {
      steps {
        echo 'Testing...'
        sh 'yarn test'
      }
    }
    stage('Archive') {
			steps {
        echo 'Creating zip...'
				sh "zip -r ./${APP_NAME}-${env.BUILD_ID}.zip ./build/**"
      }
    }

    stage('Deploy') {
      steps {
        echo 'Skipping'
        //sh "cf login -a ${CF_ENDPOINT} -u ${CF_USERNAME} -p ${CF_PASSWORD} -o ${CF_ORG} -s ${CF_SPACE}"
        //sh "cf push"
      }
    }
  }
	post {
    always {
      echo 'Done.'
			archiveArtifacts artifacts: '*.zip', fingerprint: true
			//junit 'coverage/*.xml'
    }
  }
}
