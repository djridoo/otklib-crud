import { Express } from 'express'
import { HttpServer, HttpServerFactory } from '@otklib/http-server'
import { GetHttpController } from './http/get.http-controller'
import { FindHttpController } from './http/find.http-controller'
import { CreateHttpController } from './http/create.http-controller'
import { UpdateHttpController } from './http/update.http-controller'

export class ControllersSetup {
  public static setupHttpControllers(server: HttpServer<Express>, path: string) {
    const getHttpController = new GetHttpController()
    const findHttpController = new FindHttpController()
    const createHttpController = new CreateHttpController()
    const updateHttpController = new UpdateHttpController()

    server.get(`${path}/:id`, getHttpController.handle.bind(getHttpController))
    server.patch(`${path}/:id`, updateHttpController.handle.bind(updateHttpController))
    server.get(path, findHttpController.handle.bind(findHttpController))
    server.post(path, createHttpController.handle.bind(createHttpController))
  }

  public static setupHttpServerWithControllers(port: number, path: string) {
    const server = HttpServerFactory.createExpressServer()
    this.setupHttpControllers(server, path)
    server.start(port)
  }
}
