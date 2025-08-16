import { useQuery, useMutation, useQueryClient } from 'react-query'
import { taskApi } from '@/lib/api'
import { TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'

export const useTasks = (params?: {
  status?: TaskStatus
  page?: number
  limit?: number
}) => {
  return useQuery(['tasks', params], () => taskApi.getTasks(params), {
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more frequent updates
    cacheTime: 5 * 60 * 1000, // 5 minutes cache time
    refetchOnWindowFocus: true // Refetch when window regains focus
  })
}

export const useTask = (id: string) => {
  return useQuery(['task', id], () => taskApi.getTask(id), {
    enabled: !!id
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation((task: CreateTaskRequest) => taskApi.createTask(task), {
    onMutate: async newTask => {
      await queryClient.cancelQueries(['tasks'])
      const previousTasks = queryClient.getQueryData(['tasks'])
      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old

        const optimisticTask = {
          id: `temp-${Date.now()}`,
          title: newTask.title,
          description: newTask.description,
          status: 'TO_DO' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        return {
          ...old,
          data: [optimisticTask, ...old.tasks],
          total: old.total + 1
        }
      })

      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks'])
    }
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, task }: { id: string; task: UpdateTaskRequest }) =>
      taskApi.updateTask(id, task),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['tasks'])
        queryClient.refetchQueries(['tasks'])
        queryClient.setQueryData(['task', data.id], data)
      }
    }
  )
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation((id: string) => taskApi.deleteTask(id), {
    onMutate: async deletedId => {
      await queryClient.cancelQueries(['tasks'])

      const previousTasks = queryClient.getQueryData(['tasks'])

      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old

        return {
          ...old,
          data: old.data.filter((task: any) => task.id !== deletedId),
          total: old.total - 1
        }
      })

      return { previousTasks }
    },
    onError: (err, deletedId, context) => {
      // Roll back on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: (_, __, deletedId) => {
      // Always refetch and clean up
      queryClient.invalidateQueries(['tasks'])
      queryClient.removeQueries(['task', deletedId])
    }
  })
}
