export function dealModules (origin) {
  // 处理数据
  const moduleMap = {}
  const componentMap = {}
  origin.forEach(module => {
    moduleMap[module.moduleId] = module
    componentMap[module.url] = module
  })
  const rootModules = []

  origin.forEach(module => {
    const { upperModuleId } = module
    if (upperModuleId === 0) {
      // 顶级模块，直接加入根节点列表
      rootModules.push(module)
    } else {
      // 子模块，找到对应的父模块并添加到父模块的 children 数组中
      const parentModule = moduleMap[upperModuleId]
      if (parentModule) {
        if (!parentModule.children) {
          parentModule.children = []
        }
        parentModule.children.push(module)
      }
    }
  })
  return rootModules
}
