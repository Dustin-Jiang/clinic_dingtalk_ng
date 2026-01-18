export const RECORD_STATUS_DESC = [
  '上单问题未解决',
  '预约待确认',
  '预约已确认',
  '预约已驳回',
  '登记待受理',
  '正在处理',
  '已解决问题',
  '建议返厂',
  '交给明天解决',
  '未到诊所'
]

export const enum RecordStatus {
  'UNRESOLVE', // { value: 0, text: "上单问题未解决" },
  'APPOINTMENT_PENDING', // { value: 1, text: "预约待确认" },
  'APPOINTMENT_CONFIRMED', // { value: 2, text: "预约已确认" },
  'APPOINTMENT_REJECTED', // { value: 3, text: "预约已驳回" },
  'PROCESS_PENDING', // { value: 4, text: "登记待受理" },
  'RESOLVING', // { value: 5, text: "正在处理" },
  'RESOLVED', // { value: 6, text: "已解决问题" },
  'GO_TO_OEM', // { value: 7, text: "建议返厂" },
  'ANOTHER_DAY', // { value: 8, text: "交给明天解决" },
  'WHERE_ARE_YOU' // { value: 9, text: "未到诊所" }
}

export const repairMethods = [
  {
    label: '硬件',
    value: 'hardware',
    children: [
      {
        label: '清灰',
        value: 'hardware.dust'
      },
      {
        label: '换硅脂',
        value: 'hardware.siliconGrease'
      },
      {
        label: '安装硬盘',
        value: 'hardware.installDisk'
      },
      {
        label: '更换部件',
        value: 'hardware.replacePart'
      }
    ]
  },
  {
    label: '系统',
    value: 'system',
    children: [
      {
        label: '重装',
        value: 'system.reinstall'
      },
      {
        label: '系统还原',
        value: 'system.restore'
      },
      {
        label: '清理文件',
        value: 'system.cleaning'
      },
      {
        label: '更新驱动',
        value: 'system.updateDriver'
      }
    ]
  },
  {
    label: '软件',
    value: 'software',
    children: [
      {
        label: '安装',
        value: 'software.install'
      },
      {
        label: '卸载',
        value: 'software.uninstall'
      },
      {
        label: '清理残留',
        value: 'software.cleanup'
      },
      {
        label: '配置',
        value: 'software.config'
      }
    ]
  },
  {
    label: '其他',
    value: 'other'
  }
]

export const probDescs = [
  {
    label: '硬件',
    value: 'hardware',
    children: [
      {
        label: '过热',
        value: 'hardware.overheat'
      },
      {
        label: '清灰',
        value: 'hardware.cleaning'
      },
      {
        label: '硅脂',
        value: 'hardware.siliconGrease'
      },
      {
        label: '硬盘',
        value: 'hardware.disk',
        children: [
          {
            label: '安装',
            value: 'hardware.disk.install'
          },
          {
            label: '更换',
            value: 'hardware.disk.replace'
          },
          {
            label: '迁移',
            value: 'hardware.disk.migrate'
          }
        ]
      },
      {
        label: '进水',
        value: 'hardware.water'
      },
      {
        label: '屏幕',
        value: 'hardware.screen'
      }
    ]
  },
  {
    label: '系统',
    value: 'system',
    children: [
      {
        label: '安装',
        value: 'system.install',
        children: [
          {
            label: 'Windows',
            value: 'system.install.Windows'
          },
          {
            label: 'Linux',
            value: 'system.install.Linux'
          }
        ]
      },
      {
        label: '重装',
        value: 'system.reinstall'
      },
      {
        label: '蓝屏修复',
        value: 'system.bsod'
      },
      {
        label: '文件清理',
        value: 'system.cleaning'
      },
      {
        label: '网络',
        value: 'system.network'
      },
      {
        label: '配置 Linux',
        value: 'system.linuxConfig'
      }
    ]
  },
  {
    label: '软件',
    value: 'software',
    children: [
      {
        label: '安装',
        value: 'software.install',
        children: [
          {
            label: 'AutoCAD',
            value: 'software.install.AutoCAD'
          },
          {
            label: 'ANSYS',
            value: 'software.install.ANSYS'
          },
          {
            label: 'Matlab',
            value: 'software.install.Matlab'
          },
          {
            label: 'Office',
            value: 'software.install.Office'
          },
          {
            label: 'SolidWorks',
            value: 'software.install.SolidWorks'
          },
          {
            label: '其他',
            value: 'software.install.other'
          }
        ]
      },
      {
        label: '卸载',
        value: 'software.uninstall'
      },
      {
        label: '配置',
        value: 'software.config',
        children: [
          {
            label: 'C & C++ 运行环境',
            value: 'software.config.CppEnv'
          }
        ]
      }
    ]
  },
  {
    label: '其他',
    value: 'other'
  }
]
