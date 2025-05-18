package main

import (
	"backend/config"
	"backend/database"
	"backend/handlers"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	config.LoadEnv()
	database.Connect()

	app := fiber.New()

	// for demo only, enable cors to all
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Use(logger.New())
	app.Get("/meetings", handlers.GetMeetingList)
	app.Post("/meetings", handlers.CreateMeeting)
	app.Get("/meetings/db", handlers.GetMeetingFromDB)
	app.Delete("/meetings/:id", handlers.DeleteMeeting)

	log.Println("Server running at http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
