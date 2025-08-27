export default function Task(){
    return {
  "name": "Task",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the task"
    },
    "steps": {
      "type": "array",
      "description": "List of steps for the task",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the step"
          },
          "text": {
            "type": "string",
            "description": "The step description"
          },
          "status": {
            "type": "string",
            "enum": [
              "pending",
              "completed"
            ],
            "default": "pending",
            "description": "Status of the step"
          }
        },
        "required": [
          "id",
          "text",
          "status"
        ]
      }
    }
  },
  "required": [
    "name"
  ]
}
}