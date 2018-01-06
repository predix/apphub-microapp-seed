/*
  pipeline
*/
pipeline {
  agent any
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
      steps {
        echo 'Running ${BUILD_ID} on ${JENKINS_URL}'
        sh 'printenv'
        sh 'node --version'
        sh 'npm --version'
        sh 'yarn -v'
        sh 'yarn install'
        sh 'yarn dist'
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
				sh "zip -r ./${APP_NAME}-${env.BUILD_ID}.zip ./dist/**"
      }
    }

    stage('Deploy') {
      steps {
        sh "cf login -a ${CF_ENDPOINT} -u ${CF_USERNAME} -p ${CF_PASSWORD} -o ${CF_ORG} -s ${CF_SPACE}"
        sh "cf push"
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
