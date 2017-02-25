{
  "targets": [
    {
      "target_name": "node_voce",
      "sources": ["src/cpp/node_voce.cpp"],
      "cflags": ["-Wall", "-std=c++11"],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
        "<!(echo $JAVA_HOME)/include",
        "<!(echo $JAVA_HOME)/include/linux",
        "<!(pwd)/cpp_modules"
      ],
      'xcode_settings': {
        'OTHER_CFLAGS': [
          '-std=c++11'
        ],
      },
      "conditions": [
        ['OS=="mac"',
          {
            "xcode_settings": {
              'OTHER_CPLUSPLUSFLAGS' : ['-std=c++11','-stdlib=libc++'],
              'OTHER_LDFLAGS': ['-stdlib=libc++'],
              'MACOSX_DEPLOYMENT_TARGET': '10.7'
            }
          }
        ]
      ]
    }
  ]
}