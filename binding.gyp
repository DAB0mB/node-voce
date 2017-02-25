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
        "<!(pwd)/cpp_modules/headers"
      ],
      "libraries": [
        "-L/usr/bin/java",
        "-L/usr/lib/jvm/java-8-openjdk-amd64/lib/amd64",
        "-L/usr/lib/jvm/java-8-openjdk-amd64/jre/lib/amd64/server",
        "-ljvm"
      ]
      "xcode_settings": {
        "OTHER_CFLAGS": [
          "-std=c++11"
        ],
      },
      "conditions": [
        ["OS=="mac"",
          {
            "xcode_settings": {
              "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11","-stdlib=libc++"],
              "OTHER_LDFLAGS": ["-stdlib=libc++"],
              "MACOSX_DEPLOYMENT_TARGET": "10.7"
            }
          }
        ]
      ]
    }
  ]
}