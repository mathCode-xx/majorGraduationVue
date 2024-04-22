export function dealOrganizations (origin) {
  // 处理数据
  const organizationMap = {}
  origin.forEach(organization => {
    organizationMap[organization.id] = organization
  })
  const result = []
  origin.forEach(organization => {
    const { upperId } = organization
    if (upperId === 0) {
      // 顶级模块，直接加入根节点列表
      result.push(organization)
    } else {
      // 子模块，找到对应的父模块并添加到父模块的 children 数组中
      const parent = organizationMap[upperId]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(organization)
      }
    }
  })
  return result
}
