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
   stage('Deploy to CF3 Dev') {
      steps {
        echo 'Skipping'
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
