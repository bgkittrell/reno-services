import { publish } from '../../core/messages'
import { getUserId } from '../../core/auth'
import { getProject, getProjects, createProject, updateProject, deleteProject } from './db'

export async function list(event: any) {
  const userId = getUserId(event)

  const projects = await getProjects(userId)

  return {
    statusCode: 200,
    body: JSON.stringify(projects)
  }
}

export async function get(event: any) {
  const id = event.pathParameters.id
  const userId = getUserId(event)

  const project = await getProject(userId, id)

  return {
    statusCode: 200,
    body: JSON.stringify(project)
  }
}

export async function create(event: any) {
  const project = JSON.parse(event.body)

  const userId = getUserId(event)

  const newProject = await createProject(userId, project)

  await publish('services.projects', 'project.created', {
    project: newProject
  })

  return {
    statusCode: 201,
    body: JSON.stringify(newProject)
  }
}

export async function update(event: any) {
  const id = event.pathParameters.id
  const userId = getUserId(event)
  const project = JSON.parse(event.body)

  const updatedProject = await updateProject(userId, id, project)

  await publish('services.projects', 'project.updated', {
    project: updatedProject
  })

  return {
    statusCode: 200,
    body: JSON.stringify(updatedProject)
  }
}

export async function destroy(event: any) {
  console.log('event', event)
  const id = event.pathParameters.id
  const userId = getUserId(event)

  await deleteProject(userId, id)

  await publish('services.projects', 'project.deleted', {
    project: {
      id
    }
  })

  return {
    statusCode: 204,
    body: ''
  }
}
