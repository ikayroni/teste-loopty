import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskModal from '@/components/tasks/TaskModal'
import { TaskStatus, TaskPriority } from '@/lib/types'

describe('TaskModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal with form fields', () => {
    render(
      <TaskModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    )

    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument()
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prioridade/i)).toBeInTheDocument()
  })

  it('submits form with correct data', async () => {
    render(
      <TaskModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    )

    const titleInput = screen.getByLabelText(/título/i)
    const descriptionInput = screen.getByLabelText(/descrição/i)

    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })

    const submitButton = screen.getByText('Criar')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: undefined,
      })
    })
  })

  it('calls onClose when cancel button is clicked', () => {
    render(
      <TaskModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    )

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
