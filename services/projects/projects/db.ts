import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  ScanCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb'
import { GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)
const tableName = process.env.PROJECTS_TABLE

export const getProject = async (userId: string, id: string) => {
  const record = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        UserId: userId,
        Id: id
      }
    })
  )
  if (!record.Item || record.Item.UserId !== userId) return null
  return transformFromDb(record.Item)
}

export const getProjects = async (userId: string) => {
  const records = await dynamo.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'UserId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
  )
  return records.Items?.map(transformFromDb)
}

export const createProject = async (userId: string, project: any) => {
  const id = uuidv4()
  const record: any = {
    Id: id,
    UserId: userId,
    Title: project.title,
    Budget: project.budget,
    StartDate: project.start_date,
    EndDate: project.end_date,
    Status: project.status,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: record
    })
  )
  return transformFromDb(record)
}

export const updateProject = async (userId: string, id: string, project: any) => {
  const record: any = {
    Id: id,
    UpdatedAt: new Date().toISOString(),
    Title: project.title,
    Budget: project.budget,
    StartDate: project.start_date,
    EndDate: project.end_date,
    Status: project.status
  }
  const updateExpression = Object.keys(record)
    .map((i: any) => `#${i} = :value${i}`)
    .join(', ')
  const expressionAttributeValues = Object.keys(record).reduce(
    (acc: any, i: any) => ({
      ...acc,
      [`:value${i}`]: record[i]
    }),
    {}
  )

  const expressionAttributeNames = Object.keys(record).reduce(
    (acc: any, i: any) => ({
      ...acc,
      [`#${i}`]: i
    }),
    {}
  )
  await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        UserId: userId,
        Id: id
      },
      UpdateExpression: 'SET ' + updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: {
        ...expressionAttributeValues
      }
    })
  )
  return transformFromDb(record)
}

export const deleteProject = async (userId: string, id: string) => {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        UserId: userId,
        Id: id
      }
    })
  )
}

function transformFromDb(project: any) {
  return {
    id: project.Id,
    user_id: project.UserId,
    title: project.Title,
    budget: project.Budget,
    start_date: project.StartDate,
    end_date: project.EndDate,
    status: project.Status,
    created_at: project.CreatedAt,
    updated_at: project.UpdatedAt
  }
}
