import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import { Tenant } from "talk-server/models/tenant";

/**
 * isURLInsideAllowedDomains will validate if the given origin is allowed given
 * the Tenant's domain configuration.
 */
export function isURLPermitted(
  tenant: Pick<Tenant, "allowedDomains">,
  targetURL: string
) {
  // If there aren't any domains, then we reject it, because no url we have can
  // satisfy those requirements.
  if (tenant.allowedDomains.length === 0) {
    return false;
  }

  // If the scheme can not be inferred, then we can't determine the
  // admissability of the url.
  if (doesRequireSchemePrefixing(targetURL)) {
    return false;
  }

  // Determine the scheme of the targetOrigin. We know that the targetURL does
  // not need prefixing, so it can only be true/false here.
  const originSecure = isURLSecure(targetURL) as boolean;

  // Extract the origin from the URL.
  const targetOrigin = getOrigin(targetURL);

  // Loop over all the Tenant domains provided. Prefix the domain of each if it
  // is required with the target url scheme. Return if at least one match is
  // found within the Tenant domains.
  return tenant.allowedDomains
    .map(domain => getOrigin(prefixSchemeIfRequired(originSecure, domain)))
    .some(origin => origin === targetOrigin);
}
