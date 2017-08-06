.PHONY: build help

basepath=/Users/tim/workspace/intellij/product/account-springboot

build: ## 编译
	@cd $(basepath) && mvn package -Dmaven.test.skip=true

chorme:
	@open http://localhost:8080/

jar: build ## 启动，依赖 build，编译完成后执行启动
	@cd $(basepath) && java -jar ./account-rest-provider/target/account-rest-provider-1.0-SNAPSHOT.jar
