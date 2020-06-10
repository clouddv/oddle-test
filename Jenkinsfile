pipeline {
    parameters {
        string(name: 'DEPLOY_BRANCH', defaultValue: 'staging', description: 'Enter git branch to build')
        choice(name: 'DEPLOY_ENVIRONMENT', choices: ['STAGING', 'PRODUCTION'], description: 'Select deploy environment')
    }
    environment {
        GIT_URL_SRC = "https://github.com/clouddv/oddle-test.git"
        GIT_CRED_ID = "b02feabd-d10e-406b-a76e-9471be6c2db9"
		DOCKER_REGISTRY = "clouddv/oddle-test"
		APP_NAME = "oddle-test"
		KEYPATH = "/opt/oddle-test/jenkins.key"
    }
    agent any
    options {
        timeout(time: 60, unit: 'MINUTES')
    }
    stages {
        stage('Clone code from GitHub') {
            steps {
                echo ">>> DEPLOY_BRANCH: ${params.DEPLOY_BRANCH}"
                echo ">>> DEPLOY_ENVIRONMENT: ${params.DEPLOY_ENVIRONMENT}"
				echo ">>> Cloning...."
                git branch: "${params.DEPLOY_BRANCH}", credentialsId: "${GIT_CRED_ID}", url: "${GIT_URL_SRC}"
                script {
                    GIT_COMMIT = sh(script: 'git log --format="%H" -n 1', returnStdout: true)
                    GIT_COMMIT = GIT_COMMIT.take(7);
                }
                echo ">>> GIT_COMMIT: ${GIT_COMMIT}"
            }
            post {
                success {
                    echo ">>> SUCCESS"
                }
                failure {
                    echo ">>> FAILURE"
                }
            }
        }
        stage('Build & push docker image to Docker Hub') {
            steps {
				echo ">>> Building...."
				sh 'echo ENV = $DEPLOY_ENVIRONMENT > .env'
				sh 'echo APP_VERSION = 1.0.$BUILD_ID >> .env'
				sh "cat .env"
				sh "docker build -t ${DOCKER_REGISTRY}:1.0.${BUILD_ID} ."
				sh "docker push ${DOCKER_REGISTRY}:1.0.${BUILD_ID}"
            }
            post {
                success {
                    echo ">>> SUCCESS"
                }
                failure {
                    echo ">>> FAILURE"
                }
            }
        }
        stage('Deploy new version') {
            steps {
                echo ">>> Deploying...."
				sh label: 'DEPLOY', script: 'ssh -i $KEYPATH -t jenkins@35.181.122.204 "docker rm -f ${APP_NAME} && docker run -d --name ${APP_NAME} -p 3000:3000 ${DOCKER_REGISTRY}:1.0.${BUILD_ID}"'
            }
            post {
                success {
                    echo ">>> SUCCESS"
                    sh "docker rmi -f ${DOCKER_REGISTRY}:1.0.${BUILD_ID}"
                }
                failure {
                    echo ">>> FAILURE"
                }
            }
        }
    }
}