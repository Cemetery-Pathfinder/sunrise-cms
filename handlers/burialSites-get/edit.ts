import type { Request, Response } from 'express'

import getBurialSite from '../../database/getBurialSite.js'
import getCemeteries from '../../database/getCemeteries.js'
import { getConfigProperty } from '../../helpers/config.helpers.js'
import {
  getBurialSiteStatuses,
  getBurialSiteTypes
} from '../../helpers/cache.helpers.js'
import { getBurialSiteImages } from '../../helpers/images.helpers.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const burialSite = await getBurialSite(request.params.burialSiteId)

  if (burialSite === undefined) {
    response.redirect(
      `${getConfigProperty('reverseProxy.urlPrefix')}/burialSites/?error=burialSiteIdNotFound`
    )
    return
  }

  const cemeteries = getCemeteries()
  const burialSiteImages = await getBurialSiteImages()
  const burialSiteTypes = getBurialSiteTypes()
  const burialSiteStatuses = getBurialSiteStatuses()

  response.render('burialSite-edit', {
    headTitle: burialSite.burialSiteName,

    burialSite,
    isCreate: false,

    burialSiteImages,
    burialSiteStatuses,
    burialSiteTypes,
    cemeteries
  })
}
