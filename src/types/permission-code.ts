export type PermissionCode =
  // user
  | "search-user"
  | "delete-user"
  | "create-user"
  | "update-user"

  // menu-item
  | "search-menu-item"
  | "create-menu-item"
  | "update-menu-item"
  | "delete-menu-item"
  | "search-menu-item-by-me"

  // menu-category
  | "search-menu-category"
  | "create-menu-category"
  | "update-menu-category"
  | "delete-menu-category"

  // category
  | "search-order"
  | "create-order"
  | "update-order"
  | "delete-order"

  // role
  | "search-role"
  | "read-role"
  | "create-role"
  | "update-role"
  | "delete-role"

  // permission
  | "search-permission"
  | "read-permissions"
  | "create-permission"
  | "update-permission"
  | "delete-permission"

  // employee
  | "search-employee"
  | "create-employee"
  | "update-employee"
  | "delete-employee"

  // report
  | "search-report"
  | "read-report"
  | "read-report-admin"

  // config
  | "read-config"
  | "update-config"
  | "create-config"
  | "delete-config"
  | "search-config"

  // campaign
  | "search-campaign"
  | "read-campaign"
  | "create-campaign"
  | "update-campaign"
  | "delete-campaign"

  // keyword
  | "search-keyword"
  | "read-keyword"
  | "create-keyword"
  | "update-keyword"

  // link
  | "search-link"
  | "read-link"
  | "create-link"
  | "update-link"

  // deposit
  | "search-deposit"
  | "read-deposit"
  | "create-deposit"
  | "update-deposit"
  | "delete-deposit"

  // transaction
  | "search-transaction"
  | "read-transaction"
  | "create-transaction"
  | "update-transaction"
  | "delete-transaction"

  // voucher
  | "search-voucher"
  | "read-voucher"
  | "create-voucher"
  | "update-voucher"
  | "delete-voucher"
  // wallet
  | "search-wallet"
  | "read-wallet"
  | "create-wallet"
  | "update-wallet"
  | "delete-wallet"
