/**
 * @fileoverview
 * 'whitelist': comma-separated list of domain names that are allowed as popup destinations.
 * [domain]:DomainOption, JSON.stringify'd
 */

interface DomainOption {
    whitelisted:boolean
}
