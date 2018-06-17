## Create a simple peer-group model and save parameters as JSON 
## object. 

require(openxlsx)
require(jsonlite)
require(data.table)

root_path <- "C:/Apps/"
data_input <- setDT(read.xlsx(paste0(root_path, "Sample data.xlsx")))

data_raw <- na.omit(data_input) # drop rows with NA's

## Take only AS (Travel),
## SH (Household)
## MF (Motor)
## PL (Life)
## and build indicator variables
data_raw$AS_IND <- data_raw$AS > 0 
data_raw$SH_IND <- data_raw$SH > 0 
data_raw$MF_IND <- data_raw$MF > 0 
data_raw$PL_IND <- data_raw$PL > 0 

product_combo <- as.data.table(matrix(c(F, F, F, F,
						F, F, F, T,
						F, F, T, F,
						F, F, T, T,
						F, T, F, F,
						F, T, F, T,
						F, T, T, F,
						F, T, T, T,						
						T, F, F, F,
						T, F, F, T,
						T, F, T, F,
						T, F, T, T,
						T, T, F, F,
						T, T, F, T,
						T, T, T, F,
						T, T, T, T), byrow = TRUE, ncol = 4))
colnames(product_combo) <- c("PL_IND", "MF_IND", "SH_IND", "AS_IND")
product_combo$COMBO <- 1:nrow(product_combo)

data <- merge(data_raw, product_combo)

data$AGE_BAND <- cut(data$Age, breaks = c(-Inf, 25, 45, 55, Inf))

combinations <- setDT(expand.grid(AGE_BAND = unique(data$AGE_BAND), 
				Gender = unique(data$Gender)))

for(i in 1:nrow(combinations)){
	print(combinations[i, ])
	tmp_subset <- merge(data, combinations[i, ], all = FALSE, by = c("AGE_BAND", "Gender"))
	tmp_subset <- tmp_subset[Customer.Lifetime.Value %in% c("A", "B")] 
	combinations$BEST_COMBO_IDX[i] <- which.max(table(tmp_subset$COMBO))
}
setnames(combinations, "BEST_COMBO_IDX", "COMBO")
model <- merge(combinations, product_combo, all = FALSE, by = "COMBO")

write(toJSON(model), file = paste0(root_path, "recommender_model.json"))

