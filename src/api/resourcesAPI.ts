import { BaseAPI } from './baseApi'

class ResourcesAPI extends BaseAPI {
  constructor(endpoint: string = '/resources') {
    super(endpoint)
  }

  uploadResources(data: File) {
    return this.http.post('/', { data })
  }

  public getResources(path: string): Promise<XMLHttpRequest> {
    return this.http.get(`${path}`, {})
  }
}

export default new ResourcesAPI()
