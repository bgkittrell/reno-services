import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { join } from 'path'
import { createApi, addResourcefulRoutes } from '../core/_infra'

interface ProjectsProps extends cdk.StackProps {
  eventBusName: string
  domainName: string
  zoneName: string
  jwtIssuer: string
  jwtAudience: string
}

export class ProjectsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ProjectsProps) {
    super(scope, id, props)

    const projectsTable = new dynamodb.Table(this, 'ProjectsTable2', {
      partitionKey: { name: 'UserId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'Id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    // Feeds API Gateway
    const { api, authorizer } = createApi(
      this,
      props.zoneName,
      props.domainName,
      props.jwtIssuer,
      props.jwtAudience
    )

    // Defaults for lambda functions
    const lambdaDefaults: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(100),
      environment: {
        EVENT_BUS: props.eventBusName,
        PROJECTS_TABLE: projectsTable.tableName
      }
    }

    // Create CRUD routes
    const functions = addResourcefulRoutes(
      this,
      api,
      authorizer,
      lambdaDefaults,
      'projects',
      join(__dirname, 'projects', 'api.ts')
    )

    // Give the CRUD functions access to the bucket and table
    functions.forEach((fn) => {
      projectsTable.grantReadWriteData(fn)
    })
  }
}
