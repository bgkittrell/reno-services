import { RequiredActionFunctionToolCall } from 'openai/resources/beta/threads/runs/runs'
import { AssistantTool } from 'openai/resources/beta/assistants'
import { getProjects, getProject, createProject, updateProject, deleteProject } from './projects'

async function executeTool(toolCall: RequiredActionFunctionToolCall, context: any) {
  console.log('Executing tool:', toolCall)
  if (toolCall.function.name === 'getProjects') {
    return await getProjects(context.jwtToken)
  } else if (toolCall.function.name === 'getProject') {
    const args: any = JSON.parse(toolCall.function.arguments)
    return await getProject(context.jwtToken, args.project_id)
  } else if (toolCall.function.name === 'createProject') {
    const args: any = JSON.parse(toolCall.function.arguments)
    return await createProject(context.jwtToken, args.project)
  } else if (toolCall.function.name === 'updateProject') {
    const args: any = JSON.parse(toolCall.function.arguments)
    return await updateProject(context.jwtToken, args.project_id, args.project)
  } else if (toolCall.function.name === 'deleteProject') {
    const args: any = JSON.parse(toolCall.function.arguments)
    return await deleteProject(context.jwtToken, args.project_id)
  }
}

const functions: AssistantTool[] = [
  {
    type: 'function',
    function: {
      name: 'getProjects',
      description: 'Gets a list of projects from the database.'
    }
  },
  {
    type: 'function',
    function: {
      name: 'getProject',
      description: 'Gets a project from the database.',
      parameters: {
        type: 'object',
        properties: {
          project_id: {
            type: 'string',
            description: 'The id of the project to get.'
          }
        },
        required: ['project_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'createProject',
      description: 'Creates a project in the database.',
      parameters: {
        type: 'object',
        properties: {
          project: {
            type: 'object',
            description: 'The project to create.',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the project.'
              },
              status: {
                type: 'string',
                description: 'The status of the project.'
              },
              start_date: {
                type: 'string',
                description: 'The start date of the project.'
              },
              end_date: {
                type: 'string',
                description: 'The end date of the project.'
              },
              budget: {
                type: 'number',
                description: 'The budget of the project.'
              }
            }
          }
        },
        required: ['project']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'updateProject',
      description: 'Updates a project in the database.',
      parameters: {
        type: 'object',
        properties: {
          project_id: {
            type: 'string',
            description: 'The id of the project to update.'
          },
          project: {
            type: 'object',
            description: 'The project to update.',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the project.'
              },
              status: {
                type: 'string',
                description: 'The status of the project.'
              },
              start_date: {
                type: 'string',
                description: 'The start date of the project.'
              },
              end_date: {
                type: 'string',
                description: 'The end date of the project.'
              },
              budget: {
                type: 'number',
                description: 'The budget of the project.'
              }
            }
          }
        },
        required: ['project_id', 'project']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'deleteProject',
      description: 'Deletes a project from the database.',
      parameters: {
        type: 'object',
        properties: {
          project_id: {
            type: 'string',
            description: 'The id of the project to delete.'
          }
        },
        required: ['project_id']
      }
    }
  }
]

export { executeTool, functions }
