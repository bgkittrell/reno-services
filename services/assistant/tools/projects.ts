import axios from 'axios'
const projectsApiUrl = process.env.PROJECTS_API_URL

async function getProjects(jwtToken: string) {
  if (!projectsApiUrl) {
    throw new Error('PROJECTS_API_URL is not set.')
  }
  const response = await axios.get(`${projectsApiUrl}/projects`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

async function getProject(jwtToken: string, projectId: string) {
  if (!projectsApiUrl) {
    throw new Error('PROJECTS_API_URL is not set.')
  }
  const response = await axios.get(`${projectsApiUrl}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

async function createProject(jwtToken: string, project: any) {
  if (!projectsApiUrl) {
    throw new Error('PROJECTS_API_URL is not set.')
  }
  const response = await axios.post(`${projectsApiUrl}/projects`, project, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

async function updateProject(jwtToken: string, projectId: string, project: any) {
  if (!projectsApiUrl) {
    throw new Error('PROJECTS_API_URL is not set.')
  }
  const response = await axios.put(`${projectsApiUrl}/projects/${projectId}`, project, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

async function deleteProject(jwtToken: string, projectId: string) {
  if (!projectsApiUrl) {
    throw new Error('PROJECTS_API_URL is not set.')
  }
  const response = await axios.delete(`${projectsApiUrl}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

export { getProjects, getProject, createProject, updateProject, deleteProject }
