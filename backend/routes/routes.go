package routes

import (
	"backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/meetings", handlers.CreateMeeting)
	app.Get("/meetings", handlers.GetMeetingList)
	app.Get("/meetings/db", handlers.GetMeetingFromDB)
}
