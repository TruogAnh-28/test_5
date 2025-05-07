"use client"

import React, {
  useState, useEffect,
} from "react"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Check, Search,
} from "lucide-react"
import {
  toast,
} from "sonner"

import {
  getAllPermissions,
} from "~/features/permission/api/permission"
import {
  createRolePermission, deleteRolePermission, getRolePermissionByRoleId,
} from "~/features/role-permission/api/role-permission"
import {
  type PermissionRole,
} from "~/features/role-permission/type/role-permission"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Badge,
} from "~/shared/components/ui/badge"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent,
} from "~/shared/components/ui/card"
import {
  Checkbox,
} from "~/shared/components/ui/checkbox"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "~/shared/components/ui/pagination"

export function UpdateRolePermissionForm({ role_id }: { role_id: number }) {
  const [
    isLoading,
    setIsLoading,
  ] = useState(false)
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("")
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(null)
  const itemsPerPage = 8

  const {
    data: rolePermissions,
    isLoading: isRolePermissionLoading,
    refetch: refetchRolePermissions,
  } = useQuery({
    queryKey: [
      "getRolePermissionByRoleId",
      role_id,
    ],
    queryFn: () => getRolePermissionByRoleId(role_id),
    enabled: !!role_id,
  })

  const {
    data: permissions,
    isLoading: isPermissionLoading,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: ["getAllPermissions"],
    queryFn: getAllPermissions,
    enabled: !!rolePermissions,
    select: (data) => {
      return data.data.map(permission => ({
        ...permission,
        isChecked: rolePermissions?.data.permissions.some(rolePermission => rolePermission.id === permission.id) || false,
      }))
    },
  })

  const permissionCategories = React.useMemo(
    () => {
      if (!permissions) return {
      }

      const categories: Record<string, PermissionRole[]> = {
      }

      permissions.forEach((permission) => {
        const category = permission.code.split("-")[0]
        categories[category] = [
          ...(categories[category] || []),
          permission,
        ]
      })

      return categories
    }, [permissions]
  )

  const categoryNames = React.useMemo(
    () => {
      return Object.keys(permissionCategories).sort()
    }, [permissionCategories]
  )

  const filteredPermissions = React.useMemo(
    () => {
      if (!permissions) return []

      return permissions
        .filter(permission =>
          !searchTerm
          || permission.name.toLowerCase().includes(searchTerm.toLowerCase())
          || permission.code.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(permission =>
          !selectedCategory
          || permission.code.startsWith(selectedCategory))
    }, [
      permissions,
      searchTerm,
      selectedCategory,
    ]
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage)
  const currentPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to first page when filters change
  useEffect(
    () => {
      setCurrentPage(1)
    }, [
      searchTerm,
      selectedCategory,
    ]
  )

  const handleUpdateRolePermission = async (permission_id: number) => {
    try {
      setIsLoading(true)
      const response = await createRolePermission({
        roleId: role_id,
        permissionId: permission_id,
      })
      refetchRolePermissions()
      refetchPermissions()
      toast.success(response.message || "Cập nhật thành công")
    }
    catch (error) {
      toast.error((error as Error).message || "Cập nhật thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRolePermission = async (permission_id: number) => {
    const rolePermission = rolePermissions?.data.permissions.find(p => p.id === permission_id)
    if (!rolePermission) return

    try {
      setIsLoading(true)
      await deleteRolePermission({
        roleId: role_id,
        permissionId: permission_id,
      })
      refetchRolePermissions()
      refetchPermissions()
      toast.success("Cập nhật thành công")
    }
    catch (error) {
      toast.error((error as Error).message || "Cập nhật thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }

  const shouldRenderPageNumber = (pageNumber: number) => {
    return pageNumber === 1
      || pageNumber === totalPages
      || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
  }

  const shouldRenderEllipsis = (pageNumber: number) => {
    return (pageNumber === 2 && currentPage > 3)
      || (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
  }

  const renderPaginationItems = () => {
    return Array.from({
      length: totalPages,
    }).map((
      _, index
    ) => {
      const pageNumber = index + 1
      return renderPaginationItem(pageNumber)
    })
  }
  const renderPaginationItem = (pageNumber: number) => {
    if (shouldRenderPageNumber(pageNumber)) {
      return (
        <PaginationItem key={pageNumber}>
          <PaginationLink
            isActive={currentPage === pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (shouldRenderEllipsis(pageNumber)) {
      return (
        <PaginationItem key={pageNumber}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    return null
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={
                () => setCurrentPage(prev => Math.max(
                  prev - 1, 1
                ))
              }
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {renderPaginationItems()}

          <PaginationItem>
            <PaginationNext
              onClick={
                () => setCurrentPage(prev => Math.min(
                  prev + 1, totalPages
                ))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (isRolePermissionLoading || isPermissionLoading) return <Loading />

  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />

          <Input
            placeholder="Tìm kiếm quyền..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả
          </Button>

          {
            categoryNames.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))
          }
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge
          variant="outline"
          className="bg-primary/10"
        >
          <Check className="mr-1 size-3" />

          {(rolePermissions?.data?.permissions?.length ?? 0)}

          {" "}
          quyền đã chọn
        </Badge>

        <span>/</span>

        <span>
          {permissions?.length || 0}

          {" "}
          quyền
        </span>
      </div>

      {/* Permissions grid */}
      <Card>
        <CardContent className="p-4">
          {
            currentPermissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy quyền nào phù hợp
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {
                  currentPermissions.map(permission => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={permission.isChecked}
                        disabled={isLoading}
                        onCheckedChange={
                          (checked) => {
                            checked
                              ? handleUpdateRolePermission(permission.id)
                              : handleDeleteRolePermission(permission.id)
                          }
                        }
                      />

                      <div className="flex flex-col">
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.name}
                        </label>

                        <span className="text-xs text-muted-foreground">
                          {permission.code}
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
        </CardContent>
      </Card>

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}
