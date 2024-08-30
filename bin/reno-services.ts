#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BusStack } from '../services/bus/_infra'
import { FilesStack } from '../services/files/_infra'
import { AssistantStack } from '../services/assistant/_infra'
import { AdminStack } from '../services/admin/_infra'
import { ProfilesStack } from '../services/profiles/_infra'
import { ProjectsStack } from '../services/projects/_infra'
import { StripeStack } from '../services/stripe/_infra'

const app = new cdk.App()
const environment = app.node.tryGetContext('env') || 'reno'
const busStack = new BusStack(app, `${environment}-BusStack`)
const zoneName = 'canonical.media'
const domainRoot = environment === 'prod' ? zoneName : `${environment}.${zoneName}`
const defaultProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  eventBusName: busStack.eventBusName,
  zoneName: zoneName,
  jwtIssuer: 'https://canonical.us.auth0.com/',
  jwtAudience: 'https://auth.canonical.media/'
}
new FilesStack(app, `${environment}-FilesStack`, {
  ...defaultProps,
  domainName: 'files.api.' + domainRoot,
  assetsDomainName: 'assets.' + domainRoot,
  filesBucketName: environment + '-reno-services-files'
})
new AssistantStack(app, `${environment}-AssistantStack`, {
  ...defaultProps,
  domainName: 'assistant.api.' + domainRoot,
  podcastApiUrl: 'https://podcasts.api.' + domainRoot
})
new AdminStack(app, `${environment}-AdminStack`, {
  ...defaultProps,
  domainName: 'admin.api.' + domainRoot
})
new ProfilesStack(app, `${environment}-ProfilesStack`, {
  ...defaultProps,
  domainName: 'profiles.api.' + domainRoot
})
new ProjectsStack(app, `${environment}-ProjectsStack`, {
  ...defaultProps,
  domainName: 'projects.api.' + domainRoot
})
new StripeStack(app, `${environment}-StripeStack`, {
  ...defaultProps,
  domainName: 'billing.api.' + domainRoot
})
